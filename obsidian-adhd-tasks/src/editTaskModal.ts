import { App, Modal, Notice } from "obsidian";
import { Energy, Priority, TaskItem, ENERGY_LABEL, ENERGY_ORDER, PRIORITY_LABEL, PRIORITY_ORDER } from "./types";
import { setTaskMetadata } from "./taskParser";
import type AdhdTasksPlugin from "./main";

export class EditTaskModal extends Modal {
	plugin: AdhdTasksPlugin;
	task: TaskItem;

	private due: string | null;
	private priority: Priority | null;
	private energy: Energy | null;

	constructor(app: App, plugin: AdhdTasksPlugin, task: TaskItem) {
		super(app);
		this.plugin = plugin;
		this.task = task;
		this.due = task.due;
		this.priority = task.priority;
		this.energy = task.energy;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.addClass("adhd-edit-task");

		contentEl.createEl("h3", { text: "Edit task" });
		contentEl.createEl("p", {
			text: this.task.text || "(untitled task)",
			cls: "adhd-edit-task-subtitle",
		});

		const dueField = contentEl.createDiv({ cls: "adhd-edit-field" });
		dueField.createEl("label", { text: "Due date" });
		const dueRow = dueField.createDiv({ cls: "adhd-edit-due-row" });
		const dueInput = dueRow.createEl("input", { type: "date" });
		if (this.due) dueInput.value = this.due;
		dueInput.addEventListener("change", () => {
			this.due = dueInput.value || null;
		});
		const clearDueBtn = dueRow.createEl("button", { text: "Clear", cls: "adhd-pill-button" });
		clearDueBtn.addEventListener("click", () => {
			this.due = null;
			dueInput.value = "";
		});

		const priorityField = contentEl.createDiv({ cls: "adhd-edit-field" });
		priorityField.createEl("label", { text: "Priority" });
		this.renderLevelPicker(
			priorityField,
			PRIORITY_ORDER,
			PRIORITY_LABEL,
			() => this.priority,
			(value) => {
				this.priority = value;
			}
		);

		const energyField = contentEl.createDiv({ cls: "adhd-edit-field" });
		energyField.createEl("label", { text: "Energy" });
		this.renderLevelPicker(
			energyField,
			ENERGY_ORDER,
			ENERGY_LABEL,
			() => this.energy,
			(value) => {
				this.energy = value;
			}
		);

		const footer = contentEl.createDiv({ cls: "adhd-edit-task-footer" });
		const saveBtn = footer.createEl("button", { text: "Save", cls: "mod-cta" });
		saveBtn.addEventListener("click", () => void this.save());
	}

	private renderLevelPicker<T extends string>(
		container: HTMLElement,
		order: T[],
		labels: Record<T, string>,
		getValue: () => T | null,
		setValue: (value: T | null) => void
	): void {
		const row = container.createDiv({ cls: "adhd-edit-pill-row" });
		const buttons: HTMLElement[] = [];

		const noneBtn = row.createEl("button", { text: "None", cls: "adhd-pill-button" });
		noneBtn.toggleClass("is-active", getValue() === null);
		buttons.push(noneBtn);

		const levelButtons = order.map((level) => {
			const btn = row.createEl("button", {
				text: labels[level].split(" ")[0],
				cls: "adhd-pill-button",
			});
			btn.toggleClass("is-active", getValue() === level);
			buttons.push(btn);
			return { level, btn };
		});

		const activate = (btn: HTMLElement) => {
			buttons.forEach((b) => b.removeClass("is-active"));
			btn.addClass("is-active");
		};

		noneBtn.addEventListener("click", () => {
			setValue(null);
			activate(noneBtn);
		});
		levelButtons.forEach(({ level, btn }) => {
			btn.addEventListener("click", () => {
				setValue(level);
				activate(btn);
			});
		});
	}

	private async save(): Promise<void> {
		await setTaskMetadata(this.app, this.task, {
			due: this.due,
			priority: this.priority,
			energy: this.energy,
		});
		new Notice("Task updated.");
		this.plugin.refreshTodayView();
		this.close();
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
