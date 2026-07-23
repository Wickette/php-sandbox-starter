import { App, TFile } from "obsidian";
import { Energy, Priority, TaskItem } from "./types";
import { AdhdTasksSettings } from "./settings";

const CHECKBOX_RE = /^(\s*)[-*] \[([ xX])\]\s?(.*)$/;
const DUE_RE = /📅\s*(\d{4}-\d{2}-\d{2})/;
const SNOOZE_RE = /💤\s*(\d{4}-\d{2}-\d{2})/;
const ENERGY_RE = /🔋(low|med|high)/i;
const PRIORITY_RE = /❗(low|med|high)/i;
const EST_RE = /⏳\s*(\d+)/;
const TAG_RE = /#([a-zA-Z0-9_/-]+)/g;

export function parseLine(
	raw: string,
	line: number,
	file: TFile
): TaskItem | null {
	const match = CHECKBOX_RE.exec(raw);
	if (!match) return null;
	const [, indent, mark, rest] = match;

	const due = DUE_RE.exec(rest)?.[1] ?? null;
	const snoozedUntil = SNOOZE_RE.exec(rest)?.[1] ?? null;
	const energy = (ENERGY_RE.exec(rest)?.[1]?.toLowerCase() as Energy) ?? null;
	const priority = (PRIORITY_RE.exec(rest)?.[1]?.toLowerCase() as Priority) ?? null;
	const estMatch = EST_RE.exec(rest);
	const estMinutes = estMatch ? parseInt(estMatch[1], 10) : null;

	const tags: string[] = [];
	let tagMatch: RegExpExecArray | null;
	const tagRe = new RegExp(TAG_RE);
	while ((tagMatch = tagRe.exec(rest)) !== null) {
		tags.push(tagMatch[1]);
	}

	const text = rest
		.replace(DUE_RE, "")
		.replace(SNOOZE_RE, "")
		.replace(ENERGY_RE, "")
		.replace(PRIORITY_RE, "")
		.replace(EST_RE, "")
		.replace(TAG_RE, "")
		.trim()
		.replace(/\s{2,}/g, " ");

	return {
		file,
		line,
		raw,
		indent,
		text,
		done: mark.toLowerCase() === "x",
		due,
		snoozedUntil,
		energy: energy && ["low", "med", "high"].includes(energy) ? energy : null,
		priority: priority && ["low", "med", "high"].includes(priority) ? priority : null,
		estMinutes,
		tags,
	};
}

function isInScope(path: string, settings: AdhdTasksSettings): boolean {
	if (!settings.taskFolders.trim()) return true;
	const folders = settings.taskFolders
		.split(",")
		.map((f) => f.trim())
		.filter(Boolean);
	if (folders.length === 0) return true;
	return folders.some(
		(folder) => path === folder || path.startsWith(folder.replace(/\/$/, "") + "/")
	);
}

export async function scanFile(app: App, file: TFile): Promise<TaskItem[]> {
	const content = await app.vault.cachedRead(file);
	const lines = content.split("\n");
	const tasks: TaskItem[] = [];
	lines.forEach((raw, i) => {
		const task = parseLine(raw, i, file);
		if (task) tasks.push(task);
	});
	return tasks;
}

export async function scanVault(
	app: App,
	settings: AdhdTasksSettings
): Promise<TaskItem[]> {
	const files = app.vault
		.getMarkdownFiles()
		.filter((f) => isInScope(f.path, settings));
	const results = await Promise.all(files.map((f) => scanFile(app, f)));
	return results.flat();
}

async function rewriteLine(
	app: App,
	task: TaskItem,
	transform: (raw: string) => string
): Promise<void> {
	await app.vault.process(task.file, (content) => {
		const lines = content.split("\n");
		if (lines[task.line] !== task.raw) {
			// File changed since we last scanned; best-effort match by content.
			const idx = lines.findIndex((l) => l === task.raw);
			if (idx === -1) return content;
			lines[idx] = transform(lines[idx]);
			return lines.join("\n");
		}
		lines[task.line] = transform(lines[task.line]);
		return lines.join("\n");
	});
}

export async function setDone(
	app: App,
	task: TaskItem,
	done: boolean
): Promise<void> {
	await rewriteLine(app, task, (raw) =>
		raw.replace(CHECKBOX_RE, (_m, indent, _mark, rest) => {
			return `${indent}- [${done ? "x" : " "}] ${rest}`;
		})
	);
}

export async function setSnooze(
	app: App,
	task: TaskItem,
	untilIso: string | null
): Promise<void> {
	await rewriteLine(app, task, (raw) => {
		let next = raw.replace(SNOOZE_RE, "").replace(/\s{2,}/g, " ").trimEnd();
		if (untilIso) {
			next = `${next} 💤 ${untilIso}`;
		}
		return next;
	});
}

function replaceOrRemoveToken(
	line: string,
	re: RegExp,
	newToken: string | null
): string {
	if (re.test(line)) {
		if (newToken === null) {
			return line.replace(re, "").replace(/\s{2,}/g, " ").trimEnd();
		}
		return line.replace(re, newToken);
	}
	if (newToken !== null) {
		return `${line.trimEnd()} ${newToken}`;
	}
	return line;
}

export interface TaskMetadataUpdate {
	due?: string | null;
	priority?: Priority | null;
	energy?: Energy | null;
}

export async function setTaskMetadata(
	app: App,
	task: TaskItem,
	updates: TaskMetadataUpdate
): Promise<void> {
	await rewriteLine(app, task, (raw) => {
		let next = raw;
		if ("due" in updates) {
			next = replaceOrRemoveToken(
				next,
				DUE_RE,
				updates.due ? `📅 ${updates.due}` : null
			);
		}
		if ("priority" in updates) {
			next = replaceOrRemoveToken(
				next,
				PRIORITY_RE,
				updates.priority ? `❗${updates.priority}` : null
			);
		}
		if ("energy" in updates) {
			next = replaceOrRemoveToken(
				next,
				ENERGY_RE,
				updates.energy ? `🔋${updates.energy}` : null
			);
		}
		return next;
	});
}

export async function appendTask(
	app: App,
	path: string,
	line: string
): Promise<void> {
	let file = app.vault.getAbstractFileByPath(path) as TFile | null;
	if (!file) {
		file = await app.vault.create(path, "");
	}
	await app.vault.process(file, (content) => {
		const trimmed = content.length > 0 && !content.endsWith("\n")
			? content + "\n"
			: content;
		return `${trimmed}${line}\n`;
	});
}
