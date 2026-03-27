import path from 'node:path'

import type { CliOptions } from '../types'

export function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

export function parseArgs(argv: string[]) {
  const [command, ...rest] = argv
  const options: CliOptions = {}

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index]

    if (!arg?.startsWith('--')) {
      continue
    }

    const key = arg.slice(2)
    const value = rest[index + 1]

    if (!value || value.startsWith('--')) {
      fail(`Missing value for --${key}`)
    }

    options[key] = value
    index += 1
  }

  return { command, options }
}

export function requireOption(options: CliOptions, name: string) {
  const value = options[name]

  if (!value) {
    fail(`Missing required option --${name}`)
  }

  return value
}

export function resolvePackageDir(value: string) {
  return path.resolve(process.cwd(), value)
}
