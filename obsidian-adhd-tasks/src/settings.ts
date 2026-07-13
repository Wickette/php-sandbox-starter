import { App, PluginSettingTab, Setting } from "obsidian";
import type AdhdTasksPlugin from "./main";

export interface AdhdTasksSettings {
	inboxFile: string;
	taskFolders: string;
	focusMinutes: number;
	showCompletedInToday: boolean;
	overdueGraceDays: number;
	celebrationMessages: string;
}

export const DEFAULT_SETTINGS: AdhdTasksSettings = {
	inboxFile: "Inbox.md",
	taskFolders: "",
	focusMinutes: 10,
	showCompletedInToday: false,
	overdueGraceDays: 3,
	celebrationMessages: [
		"Nice. One less thing in your head. 🌱",
		"That counts, no matter how small. ✨",
		"You showed up for that one. 👏",
		"Done is done — on to whatever's next, or not. 💛",
		"Look at you go. 🚀",
		"Progress, not perfection. 🌤️",
	].join("\n"),
};

export class AdhdTasksSettingTab extends PluginSettingTab {
	plugin: AdhdTasksPlugin;

	constructor(app: App, plugin: AdhdTasksPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "ADHD Friendly Tasks" });
		containerEl.createEl("p", {
			text:
				"Low-friction capture, a calm Today view, and gentle handling of overdue tasks. " +
				"Tasks are just normal markdown checkboxes with optional inline metadata.",
			cls: "setting-item-description",
		});

		new Setting(containerEl)
			.setName("Inbox file")
			.setDesc("Where Quick Capture and Brain Dump append new tasks. Created automatically if missing.")
			.addText((text) =>
				text
					.setPlaceholder("Inbox.md")
					.setValue(this.plugin.settings.inboxFile)
					.onChange(async (value) => {
						this.plugin.settings.inboxFile = value.trim() || "Inbox.md";
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Folders to scan")
			.setDesc(
				"Comma-separated folders to look for tasks in. Leave blank to scan the whole vault."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. Tasks, Projects")
					.setValue(this.plugin.settings.taskFolders)
					.onChange(async (value) => {
						this.plugin.settings.taskFolders = value;
						await this.plugin.saveSettings();
						this.plugin.refreshTodayView();
					})
			);

		new Setting(containerEl)
			.setName("Focus timer length (minutes)")
			.setDesc("Default length for the Focus Mode timer.")
			.addSlider((slider) =>
				slider
					.setLimits(1, 60, 1)
					.setValue(this.plugin.settings.focusMinutes)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.focusMinutes = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Overdue grace period (days)")
			.setDesc(
				"How many days a task can be overdue before it gets a gentle 'been waiting a while' badge instead of just a due date."
			)
			.addSlider((slider) =>
				slider
					.setLimits(0, 14, 1)
					.setValue(this.plugin.settings.overdueGraceDays)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.overdueGraceDays = value;
						await this.plugin.saveSettings();
						this.plugin.refreshTodayView();
					})
			);

		new Setting(containerEl)
			.setName("Show completed tasks in Today view")
			.setDesc("Keep finished tasks visible (crossed out) for a bit of visible progress.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showCompletedInToday)
					.onChange(async (value) => {
						this.plugin.settings.showCompletedInToday = value;
						await this.plugin.saveSettings();
						this.plugin.refreshTodayView();
					})
			);

		new Setting(containerEl)
			.setName("Celebration messages")
			.setDesc("One per line. A random one shows when you complete a task from the Today view.")
			.addTextArea((text) => {
				text
					.setValue(this.plugin.settings.celebrationMessages)
					.onChange(async (value) => {
						this.plugin.settings.celebrationMessages = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 6;
				text.inputEl.addClass("adhd-tasks-settings-textarea");
			});
	}
}
