# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ink Dual-Pane File Manager (TwinForge)** - A keyboard-driven terminal file manager inspired by Norton Commander, built with Ink (React for CLIs) and Node.js.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Run in development mode (tsx)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled version
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run typecheck    # Type check without emitting
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
```

## Project Structure

```
src/
├── index.tsx              # Entry point
├── types.ts               # Core interfaces (Entry, PaneState, AppState)
├── components/
│   ├── App.tsx            # Main app, state management, keyboard handling
│   ├── Pane.tsx           # File listing display
│   ├── BufferPane.tsx     # Cut/copy buffer display
│   ├── Header.tsx         # Title bar
│   ├── Footer.tsx         # Help text and status messages
│   └── Divider.tsx        # Visual separator between panes
├── logic/
│   ├── navigation.ts      # Directory open/parent operations
│   └── selection.ts       # Selection movement, scroll adjustment
└── fs/
    └── adapter.ts         # Filesystem operations (list, copy)
```

## Architecture

Three-layer architecture:

1. **UI Layer** (`src/components/`) - Ink/React components, presentational
2. **Logic Layer** (`src/logic/`) - Stateless helpers for selection, scrolling, navigation
3. **Filesystem Layer** (`src/fs/`) - Abstraction over `fs/promises`

## Key Behaviors

- Directories sorted before files, case-insensitive
- Selection always visible in viewport (auto-scroll)
- Errors displayed inline, non-modal
- Copy fails on overwrite (no prompt in v1)
- Buffer holds multiple files, supports mixed copy/cut, clears after paste

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Switch active pane |
| ↑/↓ | Move selection |
| Enter | Open directory |
| Backspace | Parent directory |
| c | Copy selected to buffer |
| x | Cut selected to buffer |
| p | Paste buffer to current pane |
| q | Quit |
