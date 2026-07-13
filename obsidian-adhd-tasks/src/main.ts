import { MarkdownView, Notice, Plugin, TFile, WorkspaceLeaf, debounce } from "obsidian";
import { AdhdTasksSettings, AdhdTasksSettingTab, DEFAULT_SETTINGS } from "./settings";
import { QuickCaptureModal } from "./quickCaptureModal";
import { TodayView, VIEW_TYPE_TODAY } from "./todayView";
import { appendTask } from "./taskParser";

export default class AdhdTasksPlugin extends Plugin {
	settings: AdhdTasksSettings = DEFAULT_SETTINGS;

	private debouncedRefresh = debounce(
		() => {
			void this.refreshTodayView();
		},
		500,
		true
	);

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_TODAY, (leaf) => new TodayView(leaf, this));

		this.addRibbonIcon("brain-circuit", "Open Today (ADHD Tasks)", () => {
			void this.activateTodayView();
		});

		this.addCommand({
			id: "open-quick-capture",
			name: "Quick capture a task",
			callback: () => this.openQuickCapture(),
		});

		this.addCommand({
			id: "open-today-view",
			name: "Open Today view",
			callback: () => void this.activateTodayView(),
		});

		this.addCommand({
			id: "brain-dump",
			name: "Brain dump (open inbox and start typing)",
			callback: () => void this.brainDump(),
		});

		this.addSettingTab(new AdhdTasksSettingTab(this.app, this));

		this.registerEvent(this.app.vault.on("modify", (file) => {
			if (file instanceof TFile && file.extension === "md") {
				this.debouncedRefresh();
			}
		}));
		this.registerEvent(this.app.vault.on("create", () => this.debouncedRefresh()));
		this.registerEvent(this.app.vault.on("delete", () => this.debouncedRefresh()));
	}

	onunload(): void {
		// Views are detached automatically by Obsidian.
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	openQuickCapture(): void {
		new QuickCaptureModal(this.app, this).open();
	}

	async brainDump(): Promise<void> {
		const path = this.settings.inboxFile;
		const isNew = !this.app.vault.getAbstractFileByPath(path);
		await appendTask(this.app, path, `- [ ] `);
		if (isNew) new Notice("Created your inbox note.");

		const file = this.app.vault.getAbstractFileByPath(path) as TFile;
		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file);
		const view = leaf.view;
		if (view instanceof MarkdownView) {
			const editor = view.editor;
			const lastLine = editor.lastLine();
			const lineText = editor.getLine(lastLine);
			editor.setCursor({ line: lastLine, ch: lineText.length });
			editor.focus();
		}
	}

	async activateTodayView(): Promise<void> {
		const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY);
		let leaf: WorkspaceLeaf;
		if (existing.length > 0) {
			leaf = existing[0];
		} else {
			const rightLeaf = this.app.workspace.getRightLeaf(false);
			if (!rightLeaf) return;
			leaf = rightLeaf;
			await leaf.setViewState({ type: VIEW_TYPE_TODAY, active: true });
		}
		await this.app.workspace.revealLeaf(leaf);
	}

	refreshTodayView(): void {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY)) {
			const view = leaf.view;
			if (view instanceof TodayView) {
				void view.refresh();
			}
		}
	}
}
