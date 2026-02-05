import React from 'react'
import { Box, Text } from 'ink'
import type { BufferEntry } from '../types.js'

interface BufferPaneProps {
  buffer: BufferEntry[]
}

export function BufferPane({ buffer }: BufferPaneProps) {
  const copyCount = buffer.filter((b) => b.mode === 'copy').length
  const cutCount = buffer.filter((b) => b.mode === 'cut').length

  return (
    <Box
      borderStyle="single"
      borderColor="yellow"
      paddingX={1}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box>
        <Text color="yellow" bold>
          Buffer
        </Text>
        {buffer.length === 0 ? (
          <Text dimColor> (empty)</Text>
        ) : (
          <Text>
            {' '}
            <Text color="gray">[</Text>
            {copyCount > 0 && (
              <Text color="green">{copyCount} copy</Text>
            )}
            {copyCount > 0 && cutCount > 0 && <Text color="gray">, </Text>}
            {cutCount > 0 && (
              <Text color="red">{cutCount} cut</Text>
            )}
            <Text color="gray">]</Text>
          </Text>
        )}
      </Box>
      <Box flexDirection="row" gap={1}>
        {buffer.slice(0, 5).map((item, index) => (
          <Text key={item.entry.path + index} color={item.mode === 'copy' ? 'green' : 'red'}>
            {item.entry.name}
            {item.entry.isDir ? '/' : ''}
          </Text>
        ))}
        {buffer.length > 5 && (
          <Text dimColor>+{buffer.length - 5} more</Text>
        )}
      </Box>
    </Box>
  )
}
