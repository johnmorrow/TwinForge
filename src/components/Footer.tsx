import React from 'react'
import { Box, Text } from 'ink'

interface FooterProps {
  selectedName?: string
  message?: string
}

export function Footer({ selectedName, message }: FooterProps) {
  return (
    <Box justifyContent="space-between" paddingX={1}>
      <Text dimColor>
        Tab:switch  ↑↓:navigate  Enter:open  Backspace:parent  c:copy  x:cut  p:paste  q:quit
      </Text>
      <Box>
        {message && <Text color="green">{message} </Text>}
        {selectedName && <Text color="white">{selectedName}</Text>}
      </Box>
    </Box>
  )
}
