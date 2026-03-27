import * as fs from 'node:fs'
import * as path from 'node:path'

import type { PackageJsonLike } from '../types'
import { fail } from './args'

export function findWorkspaceRoot(startDir: string) {
  let current = startDir

  while (true) {
    if (fs.existsSync(path.join(current, 'pnpm-workspace.yaml'))) {
      return current
    }

    const parent = path.dirname(current)

    if (parent === current) {
      fail(`Could not find pnpm-workspace.yaml from ${startDir}`)
    }

    current = parent
  }
}

export function readJson(filePath: string): PackageJsonLike {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as PackageJsonLike
}

export function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true })
}
