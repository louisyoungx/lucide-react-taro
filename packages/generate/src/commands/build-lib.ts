import * as fs from 'node:fs'
import * as path from 'node:path'

import * as esbuild from 'esbuild'
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'

import { readJson } from '../utils/fs'

export async function buildLib(packageDir: string) {
  const pkg = readJson(path.join(packageDir, 'package.json'))
  const external = [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
    'react/jsx-runtime',
  ]

  const iconsDir = path.join(packageDir, 'src', 'icons')
  const iconFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.ts'))

  const rewriteIconImportPlugin = {
    name: 'rewrite-icon-import',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^\.\.\/Icon$/ }, () => ({
        path: '../index.js',
        external: true,
      }))
    },
  }

  await Promise.all([
    esbuild.build({
      entryPoints: [path.join(packageDir, 'src', 'index.ts')],
      outfile: path.join(packageDir, 'dist', 'esm', 'index.js'),
      format: 'esm',
      bundle: true,
      external,
      target: 'es2020',
      jsx: 'automatic',
    }),
    esbuild.build({
      entryPoints: [path.join(packageDir, 'src', 'index.ts')],
      outfile: path.join(packageDir, 'dist', 'cjs', 'index.js'),
      format: 'cjs',
      bundle: true,
      external,
      target: 'es2020',
      jsx: 'automatic',
    }),
    esbuild.build({
      entryPoints: iconFiles.map(file => path.join(iconsDir, file)),
      outdir: path.join(packageDir, 'dist', 'esm', 'icons'),
      format: 'esm',
      bundle: true,
      external: [...external, '../Icon'],
      target: 'es2020',
      jsx: 'automatic',
      plugins: [rewriteIconImportPlugin],
    }),
    esbuild.build({
      entryPoints: iconFiles.map(file => path.join(iconsDir, file)),
      outdir: path.join(packageDir, 'dist', 'cjs', 'icons'),
      format: 'cjs',
      bundle: true,
      external: [...external, '../Icon'],
      target: 'es2020',
      jsx: 'automatic',
      plugins: [rewriteIconImportPlugin],
    }),
  ])

  const bundle = await rollup({
    input: path.join(packageDir, 'src', 'index.ts'),
    external,
    plugins: [dts()],
  })

  await bundle.write({
    file: path.join(packageDir, 'dist', 'types', 'index.d.ts'),
    format: 'esm',
  })

  await bundle.close()

  console.log('Library build complete')
}
