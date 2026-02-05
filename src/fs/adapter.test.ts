import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { listDirectory, copyEntry, moveEntry, getParentDirectory } from './adapter.js'

describe('adapter', () => {
  let testDir: string

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'twinforge-test-'))
  })

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true })
  })

  describe('listDirectory', () => {
    it('lists files and directories', async () => {
      await fs.mkdir(path.join(testDir, 'subdir'))
      await fs.writeFile(path.join(testDir, 'file.txt'), 'content')

      const entries = await listDirectory(testDir)

      expect(entries).toHaveLength(2)
      expect(entries[0].name).toBe('subdir')
      expect(entries[0].isDir).toBe(true)
      expect(entries[1].name).toBe('file.txt')
      expect(entries[1].isDir).toBe(false)
    })

    it('sorts directories before files', async () => {
      await fs.writeFile(path.join(testDir, 'aaa.txt'), '')
      await fs.mkdir(path.join(testDir, 'zzz'))

      const entries = await listDirectory(testDir)

      expect(entries[0].name).toBe('zzz')
      expect(entries[0].isDir).toBe(true)
      expect(entries[1].name).toBe('aaa.txt')
      expect(entries[1].isDir).toBe(false)
    })

    it('sorts case-insensitively', async () => {
      await fs.writeFile(path.join(testDir, 'Banana.txt'), '')
      await fs.writeFile(path.join(testDir, 'apple.txt'), '')
      await fs.writeFile(path.join(testDir, 'Cherry.txt'), '')

      const entries = await listDirectory(testDir)

      expect(entries.map((e) => e.name)).toEqual(['apple.txt', 'Banana.txt', 'Cherry.txt'])
    })

    it('returns empty array for empty directory', async () => {
      const entries = await listDirectory(testDir)
      expect(entries).toEqual([])
    })

    it('includes size and mtime', async () => {
      await fs.writeFile(path.join(testDir, 'file.txt'), 'hello')

      const entries = await listDirectory(testDir)

      expect(entries[0].size).toBe(5)
      expect(entries[0].mtime).toBeTypeOf('number')
    })
  })

  describe('copyEntry', () => {
    it('copies a file', async () => {
      const srcDir = path.join(testDir, 'src')
      const destDir = path.join(testDir, 'dest')
      await fs.mkdir(srcDir)
      await fs.mkdir(destDir)
      await fs.writeFile(path.join(srcDir, 'file.txt'), 'content')

      await copyEntry(path.join(srcDir, 'file.txt'), destDir)

      const destContent = await fs.readFile(path.join(destDir, 'file.txt'), 'utf-8')
      expect(destContent).toBe('content')
      // Original still exists
      const srcContent = await fs.readFile(path.join(srcDir, 'file.txt'), 'utf-8')
      expect(srcContent).toBe('content')
    })

    it('copies a directory recursively', async () => {
      const srcDir = path.join(testDir, 'src')
      const destDir = path.join(testDir, 'dest')
      await fs.mkdir(srcDir)
      await fs.mkdir(destDir)
      await fs.mkdir(path.join(srcDir, 'subdir'))
      await fs.writeFile(path.join(srcDir, 'subdir', 'file.txt'), 'nested')

      await copyEntry(path.join(srcDir, 'subdir'), destDir)

      const content = await fs.readFile(path.join(destDir, 'subdir', 'file.txt'), 'utf-8')
      expect(content).toBe('nested')
    })

    it('fails if destination exists', async () => {
      const srcDir = path.join(testDir, 'src')
      const destDir = path.join(testDir, 'dest')
      await fs.mkdir(srcDir)
      await fs.mkdir(destDir)
      await fs.writeFile(path.join(srcDir, 'file.txt'), 'source')
      await fs.writeFile(path.join(destDir, 'file.txt'), 'existing')

      await expect(copyEntry(path.join(srcDir, 'file.txt'), destDir)).rejects.toThrow()
    })
  })

  describe('moveEntry', () => {
    it('moves a file', async () => {
      const srcDir = path.join(testDir, 'src')
      const destDir = path.join(testDir, 'dest')
      await fs.mkdir(srcDir)
      await fs.mkdir(destDir)
      await fs.writeFile(path.join(srcDir, 'file.txt'), 'content')

      await moveEntry(path.join(srcDir, 'file.txt'), destDir)

      const destContent = await fs.readFile(path.join(destDir, 'file.txt'), 'utf-8')
      expect(destContent).toBe('content')
      // Original no longer exists
      await expect(fs.access(path.join(srcDir, 'file.txt'))).rejects.toThrow()
    })

    it('moves a directory', async () => {
      const srcDir = path.join(testDir, 'src')
      const destDir = path.join(testDir, 'dest')
      await fs.mkdir(srcDir)
      await fs.mkdir(destDir)
      await fs.mkdir(path.join(srcDir, 'subdir'))
      await fs.writeFile(path.join(srcDir, 'subdir', 'file.txt'), 'nested')

      await moveEntry(path.join(srcDir, 'subdir'), destDir)

      const content = await fs.readFile(path.join(destDir, 'subdir', 'file.txt'), 'utf-8')
      expect(content).toBe('nested')
      await expect(fs.access(path.join(srcDir, 'subdir'))).rejects.toThrow()
    })
  })

  describe('getParentDirectory', () => {
    it('returns parent directory', () => {
      expect(getParentDirectory('/foo/bar/baz')).toBe('/foo/bar')
    })

    it('returns root for root', () => {
      expect(getParentDirectory('/')).toBe('/')
    })
  })
})
