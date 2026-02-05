import type { PaneState } from '../types.js'

export function moveSelectionUp(pane: PaneState, viewportHeight: number): PaneState {
  if (pane.selected <= 0) {
    return pane
  }

  const newSelected = pane.selected - 1
  const newScroll = adjustScroll(newSelected, pane.scroll, viewportHeight)

  return {
    ...pane,
    selected: newSelected,
    scroll: newScroll,
  }
}

export function moveSelectionDown(pane: PaneState, viewportHeight: number): PaneState {
  if (pane.selected >= pane.entries.length - 1) {
    return pane
  }

  const newSelected = pane.selected + 1
  const newScroll = adjustScroll(newSelected, pane.scroll, viewportHeight)

  return {
    ...pane,
    selected: newSelected,
    scroll: newScroll,
  }
}

function adjustScroll(
  selected: number,
  currentScroll: number,
  viewportHeight: number
): number {
  // Keep selection visible within viewport
  if (selected < currentScroll) {
    return selected
  }
  if (selected >= currentScroll + viewportHeight) {
    return selected - viewportHeight + 1
  }
  return currentScroll
}

export function getVisibleEntries<T>(
  entries: T[],
  scroll: number,
  viewportHeight: number
): T[] {
  return entries.slice(scroll, scroll + viewportHeight)
}
