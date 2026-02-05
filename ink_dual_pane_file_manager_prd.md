# Product Requirements Document (PRD)

## Product Name
Ink Dual‑Pane File Manager

## Overview
The Ink Dual‑Pane File Manager is a keyboard‑driven terminal application inspired by classic dual‑panel file managers (e.g., Norton Commander). It is built using **Ink** (React for CLIs) and Node.js, providing fast, visual filesystem navigation directly in the terminal.

The product prioritizes clarity, speed, and composability over feature depth. It is intended both as a usable tool and as a reference architecture for building rich TUIs with Ink.

---

## Goals

### Primary Goals
- Provide a fast, intuitive dual‑pane filesystem navigator in the terminal
- Enable common file operations using keyboard‑only workflows
- Demonstrate a clean, minimal Ink architecture suitable for extension

### Non‑Goals (Initial Version)
- No mouse support
- No remote filesystem support
- No plugin system
- No background job manager (e.g., progress bars, parallel copies)

---

## Target Users
- Developers who prefer keyboard‑driven workflows
- Engineers nostalgic for dual‑pane file managers
- Developers learning Ink / TUI architecture

---

## User Experience Principles
- **Keyboard first**: Every action must be accessible via keyboard
- **Immediate feedback**: Selection and active pane are always visible
- **Low cognitive load**: Minimal modes, minimal commands
- **Predictable layout**: Panes never jump or resize unexpectedly

---

## Core Features

### 1. Dual‑Pane Layout
- Two side‑by‑side directory panes (left and right)
- Each pane maintains independent state:
  - Current working directory (CWD)
  - Directory listing
  - Selection index
  - Scroll offset

### 2. Pane Navigation
- Switch active pane using `Tab`
- Active pane is visually highlighted
- Inactive pane remains visible and static

### 3. Directory Listing
- Display files and directories in a vertical list
- Directories are sorted before files
- Sorting is case‑insensitive by name
- Each entry shows:
  - Name
  - Directory indicator (e.g., trailing `/` or icon)

### 4. Selection & Scrolling
- Move selection with `↑` / `↓`
- Selection is always kept within the visible viewport
- Scroll offset adjusts automatically

### 5. Directory Traversal
- `Enter`: Open selected directory
- `Backspace`: Navigate to parent directory
- Errors (e.g., permission denied) are surfaced inline

### 6. File Copy
- Copy selected file or directory from active pane to inactive pane
- Destination path = inactive pane CWD
- Triggered via:
  - `F5` (primary)
  - Fallback key (e.g., `c`) for terminal compatibility
- Overwrite behavior: fail with error (no prompt in v1)

### 7. Status & Feedback
- Footer line displays:
  - Current action status (e.g., "Copied file.txt")
  - Selected filename
- Errors are displayed non‑modally

### 8. Exit
- Quit application via `q` or `Ctrl+C`

---

## Keyboard Shortcuts

| Key | Action |
|----|------|
| Tab | Switch active pane |
| ↑ / ↓ | Move selection |
| Enter | Open directory |
| Backspace | Go to parent directory |
| F5 / c | Copy selected entry |
| q | Quit |

---

## Data Model

### Entry
```
Entry {
  name: string
  path: string
  isDir: boolean
  size?: number
  mtime?: number
}
```

### Pane State
```
PaneState {
  cwd: string
  entries: Entry[]
  selected: number
  scroll: number
  error?: string
}
```

### Application State
```
AppState {
  active: 'left' | 'right'
  left: PaneState
  right: PaneState
  message?: string
}
```

---

## Architecture

### UI Layer (Ink Components)
- `App`: Owns global state and keyboard handling
- `Pane`: Pure presentational component
- `Header`: Optional global status line
- `Footer`: Help and feedback
- `Divider`: Visual separator

### Logic Layer
- Centralized input handling using Ink `useInput`
- Stateless helper functions for:
  - Selection movement
  - Scroll adjustment
  - CWD changes

### Filesystem Layer
- Abstracted via a small adapter module
- Responsibilities:
  - List directory contents
  - Copy files/directories
- Uses Node.js `fs/promises`

---

## Error Handling
- Filesystem errors are caught and rendered inline
- Errors do not crash the application
- No modal dialogs in v1

---

## Performance Requirements
- Directory listings under 1,000 entries render instantly
- UI redraws should remain under one frame per keystroke
- Blocking filesystem operations are acceptable in v1

---

## Accessibility
- High‑contrast active pane highlighting
- No reliance on color alone for state

---

## Future Enhancements (Out of Scope)
- Preview pane
- Delete / rename / move
- Recursive copy progress UI
- Configurable keybindings
- Theming
- Search / filter
- Plugin system

---

## Success Criteria
- Users can navigate directories without typing shell commands
- Copying between directories requires zero path typing
- Codebase is understandable and extensible for Ink learners

---

## Open Questions
- Preferred overwrite behavior on copy?
- Directory size calculation (lazy vs eager)?
- Should `..` appear as a visible entry?

---

## Appendix: Inspiration
- Dual‑pane file managers from DOS and Unix traditions
- Keyboard‑centric workflows
- Declarative UI architecture applied to terminals

