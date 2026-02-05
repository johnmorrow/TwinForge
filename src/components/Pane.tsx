import React from 'react'
import { Box, Text } from 'ink'
import type { PaneState } from '../types.js'
import { getVisibleEntries } from '../logic/selection.js'

interface PaneProps {
  state: PaneState
  isActive: boolean
  viewportHeight: number
}

export function Pane({ state, isActive, viewportHeight }: PaneProps) {
  const { entries, selected, scroll, cwd, error } = state
  const visibleEntries = getVisibleEntries(entries, scroll, viewportHeight)

  const borderColor = isActive ? 'cyan' : 'gray'
  const titleColor = isActive ? 'cyan' : 'white'

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={borderColor}
      flexGrow={1}
      flexBasis={0}
    >
      <Box paddingX={1}>
        <Text color={titleColor} bold={isActive}>
          {cwd}
        </Text>
      </Box>

      {error && (
        <Box paddingX={1}>
          <Text color="red">{error}</Text>
        </Box>
      )}

      <Box flexDirection="column" paddingX={1}>
        {visibleEntries.length === 0 ? (
          <Text dimColor>(empty)</Text>
        ) : (
          visibleEntries.map((entry, index) => {
            const actualIndex = scroll + index
            const isSelected = actualIndex === selected

            return (
              <EntryRow
                key={entry.path}
                name={entry.name}
                isDir={entry.isDir}
                isSelected={isSelected}
                isActive={isActive}
              />
            )
          })
        )}
      </Box>
    </Box>
  )
}

interface EntryRowProps {
  name: string
  isDir: boolean
  isSelected: boolean
  isActive: boolean
}

function EntryRow({ name, isDir, isSelected, isActive }: EntryRowProps) {
  const displayName = isDir ? `${name}/` : name

  if (isSelected && isActive) {
    return (
      <Text backgroundColor="cyan" color="black">
        {displayName}
      </Text>
    )
  }

  if (isSelected) {
    return (
      <Text backgroundColor="gray" color="white">
        {displayName}
      </Text>
    )
  }

  return (
    <Text color={isDir ? 'blue' : 'white'} bold={isDir}>
      {displayName}
    </Text>
  )
}
