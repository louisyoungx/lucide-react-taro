import { spawnSync } from 'node:child_process'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

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

function isSemver(value) {
  return /^\d+\.\d+\.\d+$/.test(value)
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

  run('node', ['scripts/version-packages.mjs', strategy])
  run('pnpm', ['run', 'build:lib'])
  run('pnpm', ['--filter', 'lucide-react-taro', 'publish', '--access', 'public'])
  run('pnpm', ['run', 'build:cli'])
  run('pnpm', ['--filter', 'taro-lucide-tabbar', 'publish', '--access', 'public'])
  run('pnpm', ['--filter', 'taro-lucide-find', 'publish', '--access', 'public'])
  run('pnpm', ['--filter', 'taro-lucide-show', 'publish', '--access', 'public'])
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
