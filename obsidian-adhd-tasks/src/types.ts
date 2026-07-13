import { TFile } from "obsidian";

export type Energy = "low" | "med" | "high";

export interface TaskItem {
	file: TFile;
	line: number;
	raw: string;
	indent: string;
	text: string;
	done: boolean;
	due: string | null; // YYYY-MM-DD
	snoozedUntil: string | null; // YYYY-MM-DD
	energy: Energy | null;
	estMinutes: number | null;
	tags: string[];
}

export const ENERGY_EMOJI: Record<Energy, string> = {
	low: "🔋",
	med: "🔋🔋",
	high: "🔋🔋🔋",
};

export const ENERGY_LABEL: Record<Energy, string> = {
	low: "Low energy",
	med: "Medium energy",
	high: "High energy",
};

export const ENERGY_ORDER: Energy[] = ["low", "med", "high"];
