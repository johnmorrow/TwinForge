import fs from 'node:fs/promises'
import path from 'node:path'
import type { Entry } from '../types.js'

export async function listDirectory(dirPath: string): Promise<Entry[]> {
  const items = await fs.readdir(dirPath, { withFileTypes: true })

  const entries: Entry[] = await Promise.all(
    items.map(async (item) => {
      const fullPath = path.join(dirPath, item.name)
      let size: number | undefined
      let mtime: number | undefined

      try {
        const stat = await fs.stat(fullPath)
        size = stat.size
        mtime = stat.mtimeMs
      } catch {
        // Permission denied or other error - continue without stats
      }

      return {
        name: item.name,
        path: fullPath,
        isDir: item.isDirectory(),
        size,
        mtime,
      }
    })
  )

  return sortEntries(entries)
}

function sortEntries(entries: Entry[]): Entry[] {
  return entries.sort((a, b) => {
    // Directories first
    if (a.isDir && !b.isDir) return -1
    if (!a.isDir && b.isDir) return 1
    // Case-insensitive alphabetical
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
}

export async function copyEntry(
  sourcePath: string,
  destDir: string
): Promise<void> {
  const sourceName = path.basename(sourcePath)
  const destPath = path.join(destDir, sourceName)

  const stat = await fs.stat(sourcePath)

  if (stat.isDirectory()) {
    await copyDirectory(sourcePath, destPath)
  } else {
    await fs.copyFile(sourcePath, destPath, fs.constants.COPYFILE_EXCL)
  }
}

async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath, fs.constants.COPYFILE_EXCL)
    }
  }
}

export async function moveEntry(
  sourcePath: string,
  destDir: string
): Promise<void> {
  const sourceName = path.basename(sourcePath)
  const destPath = path.join(destDir, sourceName)

  await fs.rename(sourcePath, destPath)
}

export function getParentDirectory(dirPath: string): string {
  return path.dirname(dirPath)
}
