import { App, Modal, Notice } from "obsidian";
import { Energy } from "./types";
import { appendTask } from "./taskParser";
import { todayISO } from "./dateUtils";
import type AdhdTasksPlugin from "./main";

export class QuickCaptureModal extends Modal {
	plugin: AdhdTasksPlugin;
	private value = "";
	private energy: Energy | null = null;
	private dueToday = false;

	constructor(app: App, plugin: AdhdTasksPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.addClass("adhd-quick-capture");

		contentEl.createEl("h3", { text: "What's on your mind?" });
		contentEl.createEl("p", {
			text: "Just get it out of your head. You can clean it up later.",
			cls: "adhd-quick-capture-subtitle",
		});

		const input = contentEl.createEl("input", {
			type: "text",
			placeholder: "e.g. Email landlord about the leak",
			cls: "adhd-quick-capture-input",
		});
		input.focus();
		input.addEventListener("input", () => {
			this.value = input.value;
		});
		input.addEventListener("keydown", (evt) => {
			if (evt.key === "Enter") {
				evt.preventDefault();
				void this.submit();
			}
		});

		const optionsRow = contentEl.createDiv({ cls: "adhd-quick-capture-options" });

		const energyRow = optionsRow.createDiv({ cls: "adhd-energy-picker" });
		energyRow.createSpan({ text: "Energy: " });
		const energies: { key: Energy; label: string }[] = [
			{ key: "low", label: "🔋 Low" },
			{ key: "med", label: "🔋🔋 Med" },
			{ key: "high", label: "🔋🔋🔋 High" },
		];
		const buttons: HTMLElement[] = [];
		energies.forEach(({ key, label }) => {
			const btn = energyRow.createEl("button", { text: label, cls: "adhd-pill-button" });
			btn.addEventListener("click", () => {
				this.energy = this.energy === key ? null : key;
				buttons.forEach((b) => b.removeClass("is-active"));
				if (this.energy === key) btn.addClass("is-active");
			});
			buttons.push(btn);
		});

		const dueRow = optionsRow.createDiv({ cls: "adhd-due-picker" });
		const dueBtn = dueRow.createEl("button", {
			text: "📅 Due today",
			cls: "adhd-pill-button",
		});
		dueBtn.addEventListener("click", () => {
			this.dueToday = !this.dueToday;
			dueBtn.toggleClass("is-active", this.dueToday);
		});

		const footer = contentEl.createDiv({ cls: "adhd-quick-capture-footer" });
		const submitBtn = footer.createEl("button", {
			text: "Capture it",
			cls: "mod-cta",
		});
		submitBtn.addEventListener("click", () => void this.submit());
	}

	private async submit(): Promise<void> {
		const text = this.value.trim();
		if (!text) {
			new Notice("Type something first — even one word is fine.");
			return;
		}
		let line = `- [ ] ${text}`;
		if (this.dueToday) line += ` 📅 ${todayISO()}`;
		if (this.energy) line += ` 🔋${this.energy}`;

		await appendTask(this.app, this.plugin.settings.inboxFile, line);
		new Notice("Captured. Nice work getting that out of your head.");
		this.plugin.refreshTodayView();
		this.close();
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
