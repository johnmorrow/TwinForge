import { describe, it, expect } from 'vitest'
import { moveSelectionUp, moveSelectionDown, getVisibleEntries } from './selection.js'
import type { PaneState } from '../types.js'

function createPane(overrides: Partial<PaneState> = {}): PaneState {
  return {
    cwd: '/test',
    entries: [
      { name: 'dir1', path: '/test/dir1', isDir: true },
      { name: 'dir2', path: '/test/dir2', isDir: true },
      { name: 'file1.txt', path: '/test/file1.txt', isDir: false },
      { name: 'file2.txt', path: '/test/file2.txt', isDir: false },
      { name: 'file3.txt', path: '/test/file3.txt', isDir: false },
    ],
    selected: 0,
    scroll: 0,
    ...overrides,
  }
}

describe('moveSelectionDown', () => {
  it('moves selection down by one', () => {
    const pane = createPane({ selected: 0 })
    const result = moveSelectionDown(pane, 10)
    expect(result.selected).toBe(1)
  })

  it('does not move past last entry', () => {
    const pane = createPane({ selected: 4 })
    const result = moveSelectionDown(pane, 10)
    expect(result.selected).toBe(4)
  })

  it('adjusts scroll when selection goes below viewport', () => {
    const pane = createPane({ selected: 2, scroll: 0 })
    const result = moveSelectionDown(pane, 3)
    expect(result.selected).toBe(3)
    expect(result.scroll).toBe(1)
  })
})

describe('moveSelectionUp', () => {
  it('moves selection up by one', () => {
    const pane = createPane({ selected: 2 })
    const result = moveSelectionUp(pane, 10)
    expect(result.selected).toBe(1)
  })

  it('does not move above first entry', () => {
    const pane = createPane({ selected: 0 })
    const result = moveSelectionUp(pane, 10)
    expect(result.selected).toBe(0)
  })

  it('adjusts scroll when selection goes above viewport', () => {
    const pane = createPane({ selected: 2, scroll: 2 })
    const result = moveSelectionUp(pane, 3)
    expect(result.selected).toBe(1)
    expect(result.scroll).toBe(1)
  })
})

describe('getVisibleEntries', () => {
  it('returns correct slice of entries', () => {
    const entries = ['a', 'b', 'c', 'd', 'e']
    const visible = getVisibleEntries(entries, 1, 3)
    expect(visible).toEqual(['b', 'c', 'd'])
  })

  it('handles scroll at end of list', () => {
    const entries = ['a', 'b', 'c', 'd', 'e']
    const visible = getVisibleEntries(entries, 3, 3)
    expect(visible).toEqual(['d', 'e'])
  })
})
