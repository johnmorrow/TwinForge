# TwinForge

A keyboard-driven dual-pane file manager for the terminal, built with [Ink](https://github.com/vadimdemedes/ink) (React for CLIs).

Inspired by classic dual-panel file managers like Norton Commander.

## Features

- **Dual-pane layout** - Two independent directory views side by side
- **Buffer system** - Copy or cut multiple files, then paste them all at once
- **Keyboard-first** - Every action accessible without a mouse
- **Fast navigation** - Arrow keys, Enter to open, Backspace for parent directory

## Installation

```bash
git clone https://github.com/johnmorrow/TwinForge.git
cd TwinForge
npm install
```

## Usage

```bash
npm run dev           # Run in development mode
npm start             # Run compiled version (after build)
npm run build         # Compile TypeScript
```

Optionally pass a starting directory:

```bash
npm run dev -- /path/to/directory
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Switch active pane |
| ↑/↓ | Move selection |
| Enter | Open directory |
| Backspace | Go to parent directory |
| c | Copy selected to buffer |
| x | Cut selected to buffer |
| p | Paste buffer to current pane |
| q | Quit |

## How the Buffer Works

1. Navigate to files you want to copy or move
2. Press `c` to copy or `x` to cut - files are added to the buffer
3. Navigate to the destination directory in either pane
4. Press `p` to paste all buffered files

The buffer displays at the bottom of the screen, showing queued files in green (copy) or red (cut).

## Development

```bash
npm run typecheck     # Type check without emitting
npm run lint          # Run ESLint
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
```

## License

MIT
