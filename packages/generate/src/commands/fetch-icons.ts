import { execFileSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { ensureDir, findWorkspaceRoot } from '../utils/fs'
import { LUCIDE_REPO, writeLucideSource } from '../utils/icons'

const DEFAULT_LUCIDE_REF = 'main'
/**
 * Refs are passed to git; restrict to ref-safe characters as defense-in-depth.
 * Must start with an alphanumeric so a ref can't be parsed as a git option
 * (e.g. `-x`) or as an absolute/relative path.
 */
const REF_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/

function git(args: string[], cwd: string) {
  // execFileSync (argv form, no shell) — never interpolate `ref` into a shell string.
  execFileSync('git', args, { cwd, stdio: 'inherit' })
}

export async function fetchIcons(packageDir: string, ref: string = DEFAULT_LUCIDE_REF) {
  if (!REF_PATTERN.test(ref)) {
    throw new Error(
      `Invalid --lucide-ref "${ref}". Allowed characters: letters, digits, and . _ / - .`,
    )
  }

  const workspaceRoot = findWorkspaceRoot(packageDir)
  const cacheDir = path.join(workspaceRoot, '.lucide-cache')
  const iconsSourceDir = path.join(cacheDir, 'icons')

  console.log(`Fetching Lucide icons (ref: ${ref})...`)

  // Always start from a clean cache: this keeps the checkout hermetic and
  // reproducible (no stale files left over from a previously fetched ref, and
  // the anchored sparse pattern is fully applied from the start).
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true })
  }
  cloneRepo(cacheDir, ref)

  const svgFiles = fs.readdirSync(iconsSourceDir).filter(file => file.endsWith('.svg'))
  console.log(`Found ${svgFiles.length} icons`)

  // Stamp the exact lucide ref + commit so generation is reproducible and auditable.
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: cacheDir })
    .toString()
    .trim()
  writeLucideSource(cacheDir, { ref, commit })
  console.log(`Pinned lucide source: ref=${ref} commit=${commit}`)
}

function cloneRepo(cacheDir: string, ref: string) {
  console.log('Cloning Lucide repository (sparse checkout)...')

  ensureDir(cacheDir)
  git(['init', '-q'], cacheDir)
  git(['remote', 'add', 'origin', LUCIDE_REPO], cacheDir)
  git(['config', 'core.sparseCheckout', 'true'], cacheDir)
  // Anchored to the top-level icons/ dir only — a bare `icons/` (non-anchored)
  // also matches docs/icons and packages/*/icons in non-cone mode.
  fs.writeFileSync(path.join(cacheDir, '.git', 'info', 'sparse-checkout'), '/icons/\n')
  git(['pull', 'origin', ref, '--depth=1'], cacheDir)
}
