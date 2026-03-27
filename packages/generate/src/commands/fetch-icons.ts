import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { ensureDir, findWorkspaceRoot } from '../utils/fs'
import { LUCIDE_REPO } from '../utils/icons'

export async function fetchIcons(packageDir: string) {
  const workspaceRoot = findWorkspaceRoot(packageDir)
  const cacheDir = path.join(workspaceRoot, '.lucide-cache')
  const iconsSourceDir = path.join(cacheDir, 'icons')
  const gitIndexLock = path.join(cacheDir, '.git', 'index.lock')

  console.log('Fetching latest Lucide icons...')

  if (fs.existsSync(cacheDir)) {
    console.log('Cache directory exists, pulling latest changes...')

    if (fs.existsSync(gitIndexLock)) {
      fs.rmSync(gitIndexLock, { force: true })
    }

    try {
      execSync('git fetch origin main && git reset --hard origin/main', {
        cwd: cacheDir,
        stdio: 'inherit',
      })
    } catch {
      console.log('Failed to update cache, re-cloning...')
      fs.rmSync(cacheDir, { recursive: true, force: true })
      cloneRepo(cacheDir)
    }
  } else {
    cloneRepo(cacheDir)
  }

  const svgFiles = fs.readdirSync(iconsSourceDir).filter(file => file.endsWith('.svg'))
  console.log(`Found ${svgFiles.length} icons`)
}

function cloneRepo(cacheDir: string) {
  console.log('Cloning Lucide repository (sparse checkout)...')

  ensureDir(cacheDir)
  execSync('git init', { cwd: cacheDir, stdio: 'inherit' })
  execSync(`git remote add origin ${LUCIDE_REPO}`, { cwd: cacheDir, stdio: 'inherit' })
  execSync('git config core.sparseCheckout true', { cwd: cacheDir, stdio: 'inherit' })
  fs.writeFileSync(path.join(cacheDir, '.git', 'info', 'sparse-checkout'), 'icons/\n')
  execSync('git pull origin main --depth=1', { cwd: cacheDir, stdio: 'inherit' })
}
