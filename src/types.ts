export interface Entry {
  name: string
  path: string
  isDir: boolean
  size?: number
  mtime?: number
}

export interface PaneState {
  cwd: string
  entries: Entry[]
  selected: number
  scroll: number
  error?: string
}

export type BufferMode = 'copy' | 'cut'

export interface BufferEntry {
  entry: Entry
  mode: BufferMode
}

export interface AppState {
  active: 'left' | 'right'
  left: PaneState
  right: PaneState
  buffer: BufferEntry[]
  message?: string
}

export type PaneSide = 'left' | 'right'
