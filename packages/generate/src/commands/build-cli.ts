import * as fs from 'node:fs'
import * as path from 'node:path'

import * as esbuild from 'esbuild'

import { readJson } from '../utils/fs'

export async function buildCli(packageDir: string, entryArg: string, outfileArg: string) {
  const pkg = readJson(path.join(packageDir, 'package.json'))
  const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]

  const entry = path.resolve(packageDir, entryArg)
  const outfile = path.resolve(packageDir, outfileArg)

  await esbuild.build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    external,
  })

  const output = fs.readFileSync(outfile, 'utf8')
  const duplicateShebang = '#!/usr/bin/env node\n#!/usr/bin/env node\n'

  if (output.startsWith(duplicateShebang)) {
    fs.writeFileSync(
      outfile,
      output.replace(duplicateShebang, '#!/usr/bin/env node\n'),
    )
  }

  console.log(`CLI build complete: ${path.relative(packageDir, outfile)}`)
}
