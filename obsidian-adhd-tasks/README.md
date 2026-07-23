# ADHD Friendly Tasks

A low-friction, dopamine-friendly task manager for [Obsidian](https://obsidian.md), inspired by NeuroList. Built for ADHD brains: fast capture, one calm "Today" list instead of an overwhelming backlog, energy-based sorting, gentle (non-shaming) overdue handling, and a single-task Focus Mode so you never have to decide what's next.

Tasks are plain markdown checkboxes — no proprietary format, no database. This plugin just reads and writes normal `- [ ]` lines with a few optional emoji-tagged bits of metadata, so everything stays portable and works with your existing notes.

## Features

- **Quick Capture** — a hotkey-triggerable modal to get a thought out of your head and into your inbox note in seconds, with optional one-tap energy level and "due today" flags.
- **Brain Dump** — opens your inbox file with the cursor already on a fresh checklist line, for when even a modal is too much friction.
- **Today view** — a sidebar view showing only what's due today or overdue, sorted with the oldest-waiting items first. Everything else stays out of sight in a collapsed "Whenever" bucket so you're never staring down your entire backlog.
- **Energy-based filtering** — tag tasks 🔋low / 🔋🔋med / 🔋🔋🔋high and filter the Today view to match your energy right now.
- **Gentle overdue badges** — overdue tasks get a soft, muted badge, never red/alarming text. Past a configurable grace period they just say "been waiting a while 💛" instead of counting shameful days.
- **Pick for me** — decision paralysis relief. One click picks a random task from today's list (or the whenever bucket if today is empty) and drops you into Focus Mode.
- **Focus Mode** — a single big card with one task, a focus timer (default 10 minutes, configurable), a Done button, and quick "not now" snooze options (tomorrow / in 3 days / next Monday) so postponing something doesn't feel like a failure.
- **Click to jump to source** — clicking a task row (outside its checkbox/action buttons) opens the note and scrolls straight to that line.
- **Inline editing** — the ✏️ button on a task row (or in Focus Mode) opens a small editor for due date, priority, and energy level without leaving the sidebar.
- **Small celebrations** — completing a task from the Today view shows a random, genuinely encouraging message instead of nothing at all.

## Task metadata syntax

Tasks are ordinary checkboxes with optional inline tags, in any order:

```markdown
- [ ] Call the dentist 📅 2026-07-14 🔋low #errand
- [ ] Draft the proposal 🔋🔋🔋high ❗high ⏳45 #work
- [x] Already done, still shows if you enable it in settings
```

| Tag | Meaning |
|---|---|
| `📅 YYYY-MM-DD` | Due date |
| `🔋low` / `🔋med` / `🔋high` | Energy level needed |
| `❗low` / `❗med` / `❗high` | Priority |
| `⏳<minutes>` | Rough time estimate |
| `💤 YYYY-MM-DD` | Snoozed until this date (added automatically by the Snooze buttons) |
| `#tag` | Any normal Obsidian tag |

None of these are required — a bare `- [ ] Buy milk` works fine and shows up in the "Whenever" bucket until you give it a date. Due date, priority, and energy can all be set or changed from the Today view's ✏️ edit button instead of typing the tags by hand.

## Settings

- **Inbox file** — where Quick Capture and Brain Dump append tasks (default `Inbox.md`, created automatically).
- **Folders to scan** — restrict which folders count as task sources; leave blank to scan the whole vault.
- **Focus timer length** — default Focus Mode timer duration.
- **Overdue grace period** — how many days overdue before a task switches from a soft date badge to the "been waiting a while" badge.
- **Show completed tasks in Today view** — keep finished tasks visible (crossed out) for a moment of visible progress instead of vanishing instantly.
- **Celebration messages** — customize the random encouragement shown on task completion, one per line.

## Commands

- `Quick capture a task`
- `Open Today view`
- `Brain dump (open inbox and start typing)`

Bind these to hotkeys in Obsidian's Hotkeys settings for the fastest capture flow.

## Development

```bash
npm install
npm run dev     # watch build
npm run build   # typecheck + production build
```

This produces `main.js` alongside `manifest.json` and `styles.css`, which is everything Obsidian needs to load the plugin from `<vault>/.obsidian/plugins/adhd-friendly-tasks/`.

## Installing manually

1. Run `npm run build`.
2. Copy `manifest.json`, `main.js`, and `styles.css` into `<your vault>/.obsidian/plugins/adhd-friendly-tasks/`.
3. Reload Obsidian and enable "ADHD Friendly Tasks" in Settings → Community plugins.
