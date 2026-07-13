import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import { Energy, TaskItem, ENERGY_LABEL, ENERGY_ORDER } from "./types";
import { scanVault, setDone, setSnooze } from "./taskParser";
import { addDays, friendlyDate, todayISO, daysBetween } from "./dateUtils";
import type AdhdTasksPlugin from "./main";

export const VIEW_TYPE_TODAY = "adhd-today-view";

export class TodayView extends ItemView {
	plugin: AdhdTasksPlugin;

	private allTasks: TaskItem[] = [];
	private energyFilter: Energy | null = null;
	private focusMode = false;
	private focusTask: TaskItem | null = null;
	private whenBucketExpanded = false;

	private timerSeconds = 0;
	private timerRunning = false;
	private timerHandle: number | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: AdhdTasksPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return VIEW_TYPE_TODAY;
	}

	getDisplayText(): string {
		return "Today (ADHD Tasks)";
	}

	getIcon(): string {
		return "brain-circuit";
	}

	async onOpen(): Promise<void> {
		this.contentEl.addClass("adhd-tasks-view");
		await this.refresh();
	}

	async onClose(): Promise<void> {
		this.stopTimer();
	}

	async refresh(): Promise<void> {
		this.allTasks = await scanVault(this.app, this.plugin.settings);
		if (this.focusTask) {
			const stillThere = this.allTasks.find(
				(t) =>
					t.file.path === this.focusTask?.file.path &&
					t.raw === this.focusTask?.raw &&
					!t.done
			);
			if (!stillThere) {
				this.focusTask = null;
				this.focusMode = false;
			}
		}
		this.render();
	}

	private get today(): string {
		return todayISO();
	}

	private isForToday(task: TaskItem): boolean {
		if (task.done) return this.plugin.settings.showCompletedInToday;
		const dueToday = task.due !== null && task.due <= this.today;
		const snoozeExpired =
			task.snoozedUntil !== null && task.snoozedUntil <= this.today;
		return dueToday || snoozeExpired;
	}

	private isWhenever(task: TaskItem): boolean {
		if (task.done) return false;
		if (this.isForToday(task)) return false;
		if (task.snoozedUntil !== null && task.snoozedUntil > this.today) return false;
		if (task.due !== null && task.due > this.today) return false;
		return true;
	}

	private matchesEnergyFilter(task: TaskItem): boolean {
		if (!this.energyFilter) return true;
		return task.energy === this.energyFilter;
	}

	private todayTasks(): TaskItem[] {
		return this.allTasks
			.filter((t) => this.isForToday(t))
			.filter((t) => this.matchesEnergyFilter(t))
			.sort((a, b) => {
				if (a.done !== b.done) return a.done ? 1 : -1;
				const ad = a.due ?? this.today;
				const bd = b.due ?? this.today;
				return ad.localeCompare(bd);
			});
	}

	private wheneverTasks(): TaskItem[] {
		return this.allTasks
			.filter((t) => this.isWhenever(t))
			.filter((t) => this.matchesEnergyFilter(t));
	}

	private pickForMe(): void {
		const pool = this.todayTasks().filter((t) => !t.done);
		const fallback = this.wheneverTasks();
		const source = pool.length > 0 ? pool : fallback;
		if (source.length === 0) {
			new Notice("Nothing to pick from — you're clear!");
			return;
		}
		const choice = source[Math.floor(Math.random() * source.length)];
		this.focusTask = choice;
		this.focusMode = true;
		this.resetTimer();
		this.render();
	}

	private enterFocus(task: TaskItem): void {
		this.focusTask = task;
		this.focusMode = true;
		this.resetTimer();
		this.render();
	}

	private exitFocus(): void {
		this.focusMode = false;
		this.focusTask = null;
		this.stopTimer();
		this.render();
	}

	private async completeTask(task: TaskItem): Promise<void> {
		await setDone(this.app, task, true);
		const messages = this.plugin.settings.celebrationMessages
			.split("\n")
			.map((m) => m.trim())
			.filter(Boolean);
		const msg =
			messages.length > 0
				? messages[Math.floor(Math.random() * messages.length)]
				: "Nice work!";
		new Notice(msg);
		if (this.focusTask && task.raw === this.focusTask.raw) {
			this.exitFocus();
		}
		await this.refresh();
	}

	private async snoozeTask(task: TaskItem, untilIso: string): Promise<void> {
		await setSnooze(this.app, task, untilIso);
		new Notice(`Moved to ${friendlyDate(untilIso)}. It'll be here when you're ready.`);
		if (this.focusTask && task.raw === this.focusTask.raw) {
			this.exitFocus();
		}
		await this.refresh();
	}

	private nextMonday(): string {
		const d = new Date();
		const day = d.getDay();
		const add = ((8 - day) % 7) || 7;
		return addDays(this.today, add);
	}

	private resetTimer(): void {
		this.stopTimer();
		this.timerSeconds = this.plugin.settings.focusMinutes * 60;
	}

	private stopTimer(): void {
		if (this.timerHandle !== null) {
			window.clearInterval(this.timerHandle);
			this.timerHandle = null;
		}
		this.timerRunning = false;
	}

	private startTimer(): void {
		if (this.timerRunning) return;
		this.timerRunning = true;
		this.timerHandle = window.setInterval(() => {
			this.timerSeconds -= 1;
			if (this.timerSeconds <= 0) {
				this.stopTimer();
				this.timerSeconds = 0;
				new Notice("Time's up — no pressure. Take a breath, then decide what's next.");
			}
			this.updateTimerDisplay();
		}, 1000);
	}

	private timerDisplayEl: HTMLElement | null = null;

	private updateTimerDisplay(): void {
		if (!this.timerDisplayEl) return;
		const m = Math.floor(this.timerSeconds / 60);
		const s = this.timerSeconds % 60;
		this.timerDisplayEl.setText(`${m}:${String(s).padStart(2, "0")}`);
	}

	private render(): void {
		const container = this.contentEl;
		container.empty();
		container.addClass("adhd-tasks-view");

		if (this.focusMode && this.focusTask) {
			this.renderFocusMode(container, this.focusTask);
			return;
		}

		this.renderListMode(container);
	}

	private renderListMode(container: HTMLElement): void {
		const header = container.createDiv({ cls: "adhd-header" });
		header.createEl("h2", { text: "Today" });

		const actions = header.createDiv({ cls: "adhd-header-actions" });
		const captureBtn = actions.createEl("button", {
			text: "✏️ Capture",
			cls: "adhd-pill-button",
		});
		captureBtn.addEventListener("click", () => this.plugin.openQuickCapture());

		const pickBtn = actions.createEl("button", {
			text: "🎲 Pick for me",
			cls: "adhd-pill-button",
		});
		pickBtn.addEventListener("click", () => this.pickForMe());

		const filterRow = container.createDiv({ cls: "adhd-filter-row" });
		filterRow.createSpan({ text: "Energy: ", cls: "adhd-filter-label" });
		const all = filterRow.createEl("button", { text: "All", cls: "adhd-pill-button" });
		all.toggleClass("is-active", this.energyFilter === null);
		all.addEventListener("click", () => {
			this.energyFilter = null;
			this.render();
		});
		ENERGY_ORDER.forEach((energy) => {
			const btn = filterRow.createEl("button", {
				text: ENERGY_LABEL[energy].replace(" energy", ""),
				cls: "adhd-pill-button",
			});
			btn.toggleClass("is-active", this.energyFilter === energy);
			btn.addEventListener("click", () => {
				this.energyFilter = this.energyFilter === energy ? null : energy;
				this.render();
			});
		});

		const list = this.todayTasks();

		if (list.length === 0) {
			const empty = container.createDiv({ cls: "adhd-empty-state" });
			empty.createEl("p", { text: "Nothing pinned for today. Nice and clear. 🌤️" });
			const wheneverCount = this.wheneverTasks().length;
			if (wheneverCount > 0) {
				const btn = empty.createEl("button", {
					text: `See ${wheneverCount} whenever-task${wheneverCount === 1 ? "" : "s"}`,
					cls: "adhd-pill-button",
				});
				btn.addEventListener("click", () => {
					this.whenBucketExpanded = true;
					this.render();
				});
			}
		} else {
			const listEl = container.createDiv({ cls: "adhd-task-list" });
			list.forEach((task) => this.renderTaskRow(listEl, task));
		}

		const whenever = this.wheneverTasks();
		if (whenever.length > 0) {
			const section = container.createDiv({ cls: "adhd-whenever-section" });
			const toggle = section.createEl("button", {
				text: `${this.whenBucketExpanded ? "▾" : "▸"} Whenever (${whenever.length})`,
				cls: "adhd-collapse-toggle",
			});
			toggle.addEventListener("click", () => {
				this.whenBucketExpanded = !this.whenBucketExpanded;
				this.render();
			});
			if (this.whenBucketExpanded) {
				const listEl = section.createDiv({ cls: "adhd-task-list" });
				whenever.forEach((task) => this.renderTaskRow(listEl, task));
			}
		}
	}

	private renderTaskRow(container: HTMLElement, task: TaskItem): void {
		const row = container.createDiv({ cls: "adhd-task-row" });
		if (task.done) row.addClass("is-done");

		const checkbox = row.createEl("input", { type: "checkbox" });
		checkbox.checked = task.done;
		checkbox.addEventListener("click", (evt) => {
			evt.stopPropagation();
			void this.completeTask(task);
		});

		const main = row.createDiv({ cls: "adhd-task-main" });
		main.createSpan({ text: task.text || "(untitled task)", cls: "adhd-task-text" });

		const badges = main.createDiv({ cls: "adhd-task-badges" });
		if (task.energy) {
			badges.createSpan({
				text: ENERGY_LABEL[task.energy],
				cls: `adhd-badge adhd-badge-energy-${task.energy}`,
			});
		}
		if (task.due) {
			badges.createSpan({
				text: this.dueBadgeText(task.due),
				cls: `adhd-badge ${this.dueBadgeClass(task.due)}`,
			});
		}
		task.tags.forEach((tag) => {
			badges.createSpan({ text: `#${tag}`, cls: "adhd-badge adhd-badge-tag" });
		});

		const rowActions = row.createDiv({ cls: "adhd-task-row-actions" });
		const focusBtn = rowActions.createEl("button", { text: "🎯", cls: "adhd-icon-button" });
		focusBtn.setAttribute("aria-label", "Focus on this task");
		focusBtn.addEventListener("click", () => this.enterFocus(task));

		const snoozeBtn = rowActions.createEl("button", { text: "💤", cls: "adhd-icon-button" });
		snoozeBtn.setAttribute("aria-label", "Snooze");
		snoozeBtn.addEventListener("click", () => this.showSnoozeMenu(snoozeBtn, task));
	}

	private dueBadgeText(due: string): string {
		if (due > this.today) return `📅 ${friendlyDate(due)}`;
		const overdueDays = daysBetween(due, this.today);
		if (overdueDays === 0) return "📅 due today";
		if (overdueDays <= this.plugin.settings.overdueGraceDays) {
			return `📅 ${friendlyDate(due)}`;
		}
		return "been waiting a while 💛";
	}

	private dueBadgeClass(due: string): string {
		if (due >= this.today) return "adhd-badge-due-soon";
		const overdueDays = daysBetween(due, this.today);
		if (overdueDays <= this.plugin.settings.overdueGraceDays) {
			return "adhd-badge-due-gentle";
		}
		return "adhd-badge-due-long";
	}

	private showSnoozeMenu(anchor: HTMLElement, task: TaskItem): void {
		const existing = anchor.parentElement?.querySelector(".adhd-snooze-menu");
		if (existing) {
			existing.remove();
			return;
		}
		const menu = anchor.parentElement!.createDiv({ cls: "adhd-snooze-menu" });
		const options: { label: string; iso: string }[] = [
			{ label: "Tomorrow", iso: addDays(this.today, 1) },
			{ label: "In 3 days", iso: addDays(this.today, 3) },
			{ label: "Next Monday", iso: this.nextMonday() },
		];
		options.forEach((opt) => {
			const btn = menu.createEl("button", { text: opt.label, cls: "adhd-pill-button" });
			btn.addEventListener("click", () => {
				menu.remove();
				void this.snoozeTask(task, opt.iso);
			});
		});
	}

	private renderFocusMode(container: HTMLElement, task: TaskItem): void {
		const wrap = container.createDiv({ cls: "adhd-focus-mode" });

		const back = wrap.createEl("button", { text: "← Back to list", cls: "adhd-pill-button" });
		back.addEventListener("click", () => this.exitFocus());

		const card = wrap.createDiv({ cls: "adhd-focus-card" });
		card.createEl("p", { text: "Just this one.", cls: "adhd-focus-eyebrow" });
		card.createEl("h1", { text: task.text || "(untitled task)" });

		const badges = card.createDiv({ cls: "adhd-task-badges adhd-focus-badges" });
		if (task.energy) {
			badges.createSpan({
				text: ENERGY_LABEL[task.energy],
				cls: `adhd-badge adhd-badge-energy-${task.energy}`,
			});
		}
		if (task.due) {
			badges.createSpan({
				text: this.dueBadgeText(task.due),
				cls: `adhd-badge ${this.dueBadgeClass(task.due)}`,
			});
		}

		const timerWrap = card.createDiv({ cls: "adhd-timer" });
		this.timerDisplayEl = timerWrap.createEl("div", { cls: "adhd-timer-display" });
		this.updateTimerDisplay();
		const timerControls = timerWrap.createDiv({ cls: "adhd-timer-controls" });
		const startPauseBtn = timerControls.createEl("button", {
			text: this.timerRunning ? "Pause" : "Start focus timer",
			cls: "adhd-pill-button",
		});
		startPauseBtn.addEventListener("click", () => {
			if (this.timerRunning) {
				this.stopTimer();
			} else {
				this.startTimer();
			}
			this.render();
		});
		const resetBtn = timerControls.createEl("button", { text: "Reset", cls: "adhd-pill-button" });
		resetBtn.addEventListener("click", () => {
			this.resetTimer();
			this.render();
		});

		const bigActions = card.createDiv({ cls: "adhd-focus-actions" });
		const doneBtn = bigActions.createEl("button", { text: "✅ Done", cls: "mod-cta" });
		doneBtn.addEventListener("click", () => void this.completeTask(task));

		const skipBtn = bigActions.createEl("button", { text: "⏭️ Pick another", cls: "adhd-pill-button" });
		skipBtn.addEventListener("click", () => this.pickForMe());

		const snoozeRow = card.createDiv({ cls: "adhd-focus-snooze-row" });
		snoozeRow.createSpan({ text: "Not now: ", cls: "adhd-filter-label" });
		const options: { label: string; iso: string }[] = [
			{ label: "Tomorrow", iso: addDays(this.today, 1) },
			{ label: "In 3 days", iso: addDays(this.today, 3) },
			{ label: "Next Monday", iso: this.nextMonday() },
		];
		options.forEach((opt) => {
			const btn = snoozeRow.createEl("button", { text: opt.label, cls: "adhd-pill-button" });
			btn.addEventListener("click", () => void this.snoozeTask(task, opt.iso));
		});
	}
}
