import type { PaneState } from '../types.js'
import { listDirectory, getParentDirectory } from '../fs/adapter.js'

export async function openDirectory(
  pane: PaneState,
  path: string
): Promise<PaneState> {
  try {
    const entries = await listDirectory(path)
    return {
      cwd: path,
      entries,
      selected: 0,
      scroll: 0,
      error: undefined,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      ...pane,
      error: message,
    }
  }
}

export async function openSelected(pane: PaneState): Promise<PaneState> {
  const entry = pane.entries[pane.selected]
  if (!entry || !entry.isDir) {
    return pane
  }
  return openDirectory(pane, entry.path)
}

export async function openParent(pane: PaneState): Promise<PaneState> {
  const parent = getParentDirectory(pane.cwd)
  if (parent === pane.cwd) {
    // Already at root
    return pane
  }
  return openDirectory(pane, parent)
}

export function createInitialPaneState(cwd: string): PaneState {
  return {
    cwd,
    entries: [],
    selected: 0,
    scroll: 0,
  }
}
