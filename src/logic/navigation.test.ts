import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { openDirectory, openSelected, openParent, createInitialPaneState } from './navigation.js'
import type { PaneState } from '../types.js'

describe('navigation', () => {
  let testDir: string

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'twinforge-nav-test-'))
  })

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true })
  })

  describe('openDirectory', () => {
    it('loads directory entries', async () => {
      await fs.mkdir(path.join(testDir, 'subdir'))
      await fs.writeFile(path.join(testDir, 'file.txt'), '')

      const pane = createInitialPaneState(testDir)
      const result = await openDirectory(pane, testDir)

      expect(result.cwd).toBe(testDir)
      expect(result.entries).toHaveLength(2)
      expect(result.selected).toBe(0)
      expect(result.scroll).toBe(0)
      expect(result.error).toBeUndefined()
    })

    it('resets selection and scroll', async () => {
      await fs.writeFile(path.join(testDir, 'file.txt'), '')

      const pane: PaneState = {
        cwd: '/old',
        entries: [],
        selected: 5,
        scroll: 3,
      }
      const result = await openDirectory(pane, testDir)

      expect(result.selected).toBe(0)
      expect(result.scroll).toBe(0)
    })

    it('sets error on failure', async () => {
      const pane = createInitialPaneState(testDir)
      const result = await openDirectory(pane, '/nonexistent/path/that/does/not/exist')

      expect(result.error).toBeDefined()
      expect(result.cwd).toBe(testDir) // Keeps old cwd
    })
  })

  describe('openSelected', () => {
    it('opens selected directory', async () => {
      const subdir = path.join(testDir, 'subdir')
      await fs.mkdir(subdir)
      await fs.writeFile(path.join(subdir, 'nested.txt'), '')

      const pane: PaneState = {
        cwd: testDir,
        entries: [{ name: 'subdir', path: subdir, isDir: true }],
        selected: 0,
        scroll: 0,
      }

      const result = await openSelected(pane)

      expect(result.cwd).toBe(subdir)
      expect(result.entries).toHaveLength(1)
      expect(result.entries[0].name).toBe('nested.txt')
    })

    it('does nothing for files', async () => {
      const filePath = path.join(testDir, 'file.txt')
      await fs.writeFile(filePath, '')

      const pane: PaneState = {
        cwd: testDir,
        entries: [{ name: 'file.txt', path: filePath, isDir: false }],
        selected: 0,
        scroll: 0,
      }

      const result = await openSelected(pane)

      expect(result).toBe(pane) // Same reference, unchanged
    })

    it('does nothing when no entry selected', async () => {
      const pane: PaneState = {
        cwd: testDir,
        entries: [],
        selected: 0,
        scroll: 0,
      }

      const result = await openSelected(pane)

      expect(result).toBe(pane)
    })
  })

  describe('openParent', () => {
    it('navigates to parent directory', async () => {
      const subdir = path.join(testDir, 'subdir')
      await fs.mkdir(subdir)

      const pane: PaneState = {
        cwd: subdir,
        entries: [],
        selected: 0,
        scroll: 0,
      }

      const result = await openParent(pane)

      expect(result.cwd).toBe(testDir)
    })

    it('stays at root when already at root', async () => {
      const pane: PaneState = {
        cwd: '/',
        entries: [],
        selected: 0,
        scroll: 0,
      }

      const result = await openParent(pane)

      expect(result.cwd).toBe('/')
    })
  })

  describe('createInitialPaneState', () => {
    it('creates empty pane state', () => {
      const pane = createInitialPaneState('/test/path')

      expect(pane.cwd).toBe('/test/path')
      expect(pane.entries).toEqual([])
      expect(pane.selected).toBe(0)
      expect(pane.scroll).toBe(0)
    })
  })
})
