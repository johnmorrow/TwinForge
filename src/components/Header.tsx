import React from 'react'
import { Box, Text } from 'ink'

interface HeaderProps {
  message?: string
}

export function Header({ message }: HeaderProps) {
  return (
    <Box justifyContent="center" paddingY={0}>
      <Text bold color="cyan">
        TwinForge
      </Text>
      {message && (
        <Text color="yellow"> - {message}</Text>
      )}
    </Box>
  )
}
