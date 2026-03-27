import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const VERSION_FILES = [
  'package.json',
  'packages/generate/package.json',
  'packages/lucide-react-taro/package.json',
  'packages/taro-lucide-tabbar/package.json',
  'packages/taro-lucide-find/package.json',
  'packages/taro-lucide-show/package.json',
]

const VERSION_CHOICES = {
  '': 'patch',
  '1': 'patch',
  patch: 'patch',
  p: 'patch',
  '2': 'minor',
  minor: 'minor',
  m: 'minor',
  '3': 'major',
  major: 'major',
  M: 'major',
  '4': 'custom',
  custom: 'custom',
  c: 'custom',
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function runAndCapture(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    const error = result.stderr?.trim() || result.stdout?.trim() || `${command} failed`
    throw new Error(error)
  }

  return result.stdout?.trim() ?? ''
}

function isSemver(value) {
  return /^\d+\.\d+\.\d+$/.test(value)
}

function readRootVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return packageJson.version
}

function ensureCleanWorkingTree() {
  const status = runAndCapture('git', ['status', '--porcelain'])

  if (status) {
    throw new Error('Git working tree is not clean. Commit or stash changes before release.')
  }
}

function commitVersionChanges(version) {
  const hasVersionDiff =
    spawnSync('git', ['diff', '--quiet', '--', ...VERSION_FILES], {
      shell: process.platform === 'win32',
    }).status !== 0

  if (!hasVersionDiff) {
    return
  }

  run('git', ['add', ...VERSION_FILES])
  run('git', ['commit', '-m', `chore: release v${version}`])
}

async function promptVersionStrategy() {
  if (!process.stdin.isTTY) {
    return 'patch'
  }

  const rl = readline.createInterface({ input, output })

  try {
    output.write(
      [
        'Select version bump strategy:',
        '  [1] patch (default)',
        '  [2] minor',
        '  [3] major',
        '  [4] custom',
      ].join('\n') + '\n',
    )

    const strategyInput = (await rl.question('Choice: ')).trim()
    const strategy = VERSION_CHOICES[strategyInput]

    if (!strategy) {
      throw new Error(`Unsupported choice: ${strategyInput}`)
    }

    if (strategy !== 'custom') {
      return strategy
    }

    const customVersion = (await rl.question('Custom version (x.y.z): ')).trim()

    if (!isSemver(customVersion)) {
      throw new Error(`Invalid version: ${customVersion}`)
    }

    return customVersion
  } finally {
    rl.close()
  }
}

async function main() {
  const strategy = process.argv[2] || (await promptVersionStrategy())

  ensureCleanWorkingTree()
  run('node', ['scripts/version-packages.mjs', strategy])
  const version = readRootVersion()
  run('pnpm', ['run', 'build:lib'])
  run('pnpm', ['--filter', 'lucide-react-taro', 'publish', '--access', 'public', '--no-git-checks'])
  run('pnpm', ['run', 'build:cli'])
  run('pnpm', ['--filter', 'taro-lucide-tabbar', 'publish', '--access', 'public', '--no-git-checks'])
  run('pnpm', ['--filter', 'taro-lucide-find', 'publish', '--access', 'public', '--no-git-checks'])
  run('pnpm', ['--filter', 'taro-lucide-show', 'publish', '--access', 'public', '--no-git-checks'])
  commitVersionChanges(version)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
