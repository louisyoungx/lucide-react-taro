#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const binDir = path.dirname(fileURLToPath(import.meta.url))
const packageDir = path.resolve(binDir, '..')
const tsxBin = path.join(
  packageDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsx.cmd' : 'tsx',
)
const cliPath = path.join(packageDir, 'src', 'cli.ts')

const result = spawnSync(tsxBin, [cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
