import React, { useState, useEffect, useCallback } from 'react'
import { Box, useInput, useApp, useStdout } from 'ink'
import type { AppState, PaneState, PaneSide, BufferMode } from '../types.js'
import { openDirectory, openSelected, openParent } from '../logic/navigation.js'
import { moveSelectionUp, moveSelectionDown } from '../logic/selection.js'
import { copyEntry, moveEntry } from '../fs/adapter.js'
import { Header } from './Header.js'
import { Footer } from './Footer.js'
import { Pane } from './Pane.js'
import { Divider } from './Divider.js'
import { BufferPane } from './BufferPane.js'

interface AppProps {
  initialDir?: string
}

const DEFAULT_VIEWPORT_HEIGHT = 20

export function App({ initialDir }: AppProps) {
  const { exit } = useApp()
  const { stdout } = useStdout()

  const viewportHeight = stdout
    ? Math.max(5, stdout.rows - 8)
    : DEFAULT_VIEWPORT_HEIGHT

  const [state, setState] = useState<AppState>(() => ({
    active: 'left',
    left: createEmptyPane(initialDir || process.cwd()),
    right: createEmptyPane(initialDir || process.cwd()),
    buffer: [],
  }))

  useEffect(() => {
    async function init() {
      const cwd = initialDir || process.cwd()
      const [leftPane, rightPane] = await Promise.all([
        openDirectory(state.left, cwd),
        openDirectory(state.right, cwd),
      ])
      setState((s) => ({
        ...s,
        left: leftPane,
        right: rightPane,
      }))
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updatePane = useCallback(
    (side: PaneSide, updater: (pane: PaneState) => PaneState) => {
      setState((s) => ({
        ...s,
        [side]: updater(s[side]),
      }))
    },
    []
  )

  const updateActivePane = useCallback(
    (updater: (pane: PaneState) => PaneState) => {
      setState((s) => ({
        ...s,
        [s.active]: updater(s[s.active]),
      }))
    },
    []
  )

  const setMessage = useCallback((message: string | undefined) => {
    setState((s) => ({ ...s, message }))
    if (message) {
      setTimeout(() => setState((s) => ({ ...s, message: undefined })), 3000)
    }
  }, [])

  const addToBuffer = useCallback((mode: BufferMode) => {
    setState((s) => {
      const activePane = s[s.active]
      const entry = activePane.entries[activePane.selected]
      if (!entry) {
        return { ...s, message: 'Nothing to add' }
      }

      // Check if already in buffer
      const exists = s.buffer.some((b) => b.entry.path === entry.path)
      if (exists) {
        return { ...s, message: `${entry.name} already in buffer` }
      }

      return {
        ...s,
        buffer: [...s.buffer, { entry, mode }],
        message: `${mode === 'copy' ? 'Copied' : 'Cut'} ${entry.name} to buffer`,
      }
    })
  }, [])

  const handlePaste = async () => {
    if (state.buffer.length === 0) {
      setMessage('Buffer is empty')
      return
    }

    const activePane = state[state.active]
    const destDir = activePane.cwd
    let successCount = 0
    let errorCount = 0

    for (const item of state.buffer) {
      try {
        if (item.mode === 'copy') {
          await copyEntry(item.entry.path, destDir)
        } else {
          await moveEntry(item.entry.path, destDir)
        }
        successCount++
      } catch {
        errorCount++
      }
    }

    // Clear buffer and refresh both panes
    const [leftPane, rightPane] = await Promise.all([
      openDirectory(state.left, state.left.cwd),
      openDirectory(state.right, state.right.cwd),
    ])

    setState((s) => ({
      ...s,
      left: leftPane,
      right: rightPane,
      buffer: [],
      message:
        errorCount > 0
          ? `Pasted ${successCount}, ${errorCount} failed`
          : `Pasted ${successCount} item${successCount !== 1 ? 's' : ''}`,
    }))
  }

  useInput((input, key) => {
    if (input === 'q') {
      exit()
      return
    }

    if (key.tab) {
      setState((s) => ({
        ...s,
        active: s.active === 'left' ? 'right' : 'left',
      }))
      return
    }

    if (key.upArrow) {
      updateActivePane((pane) => moveSelectionUp(pane, viewportHeight))
      return
    }

    if (key.downArrow) {
      updateActivePane((pane) => moveSelectionDown(pane, viewportHeight))
      return
    }

    if (key.return) {
      const activePane = state[state.active]
      const entry = activePane.entries[activePane.selected]
      if (entry?.isDir) {
        openSelected(activePane).then((newPane) => {
          updatePane(state.active, () => newPane)
        })
      }
      return
    }

    if (key.backspace || key.delete) {
      const activePane = state[state.active]
      openParent(activePane).then((newPane) => {
        updatePane(state.active, () => newPane)
      })
      return
    }

    if (input === 'c') {
      addToBuffer('copy')
      return
    }

    if (input === 'x') {
      addToBuffer('cut')
      return
    }

    if (input === 'p') {
      handlePaste()
      return
    }
  })

  const activePane = state[state.active]
  const selectedEntry = activePane.entries[activePane.selected]

  return (
    <Box flexDirection="column" height={viewportHeight + 6}>
      <Header />
      <Box flexGrow={1}>
        <Pane
          state={state.left}
          isActive={state.active === 'left'}
          viewportHeight={viewportHeight}
        />
        <Divider />
        <Pane
          state={state.right}
          isActive={state.active === 'right'}
          viewportHeight={viewportHeight}
        />
      </Box>
      <BufferPane buffer={state.buffer} />
      <Footer selectedName={selectedEntry?.name} message={state.message} />
    </Box>
  )
}

function createEmptyPane(cwd: string): PaneState {
  return {
    cwd,
    entries: [],
    selected: 0,
    scroll: 0,
  }
}
