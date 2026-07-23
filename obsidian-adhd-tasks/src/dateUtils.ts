export function todayISO(): string {
	return toISO(new Date());
}

export function toISO(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
	const [y, m, d] = iso.split("-").map(Number);
	const date = new Date(y, (m ?? 1) - 1, d ?? 1);
	date.setDate(date.getDate() + days);
	return toISO(date);
}

export function daysBetween(fromIso: string, toIso: string): number {
	const [fy, fm, fd] = fromIso.split("-").map(Number);
	const [ty, tm, td] = toIso.split("-").map(Number);
	const from = new Date(fy, (fm ?? 1) - 1, fd ?? 1);
	const to = new Date(ty, (tm ?? 1) - 1, td ?? 1);
	const msPerDay = 1000 * 60 * 60 * 24;
	return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

export function friendlyDate(iso: string): string {
	const today = todayISO();
	const diff = daysBetween(today, iso);
	if (diff === 0) return "today";
	if (diff === 1) return "tomorrow";
	if (diff === -1) return "yesterday";
	if (diff > 1 && diff <= 6) return `in ${diff} days`;
	if (diff < -1 && diff >= -6) return `${Math.abs(diff)} days ago`;
	return iso;
}
