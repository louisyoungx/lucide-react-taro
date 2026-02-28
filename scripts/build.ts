import * as esbuild from 'esbuild'
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import { readdirSync, readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const external = [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
    'react/jsx-runtime',
]

const rewriteIconImportPlugin: esbuild.Plugin = {
    name: 'rewrite-icon-import',
    setup(build) {
        build.onResolve({ filter: /^\.\.\/Icon$/ }, () => ({
            path: '../index.js',
            external: true,
        }))
    },
}

async function buildJS() {
    const iconsDir = './src/icons'
    const iconFiles = readdirSync(iconsDir).filter(f => f.endsWith('.ts'))

    await Promise.all([
        esbuild.build({
            entryPoints: ['src/index.ts'],
            outfile: 'dist/esm/index.js',
            format: 'esm',
            bundle: true,
            external,
            target: 'es2020',
            jsx: 'automatic',
        }),
        esbuild.build({
            entryPoints: ['src/index.ts'],
            outfile: 'dist/cjs/index.js',
            format: 'cjs',
            bundle: true,
            external,
            target: 'es2020',
            jsx: 'automatic',
        }),
        esbuild.build({
            entryPoints: iconFiles.map(f => `${iconsDir}/${f}`),
            outdir: 'dist/esm/icons',
            format: 'esm',
            bundle: true,
            external: [...external, '../Icon'],
            target: 'es2020',
            jsx: 'automatic',
            plugins: [rewriteIconImportPlugin],
        }),
        esbuild.build({
            entryPoints: iconFiles.map(f => `${iconsDir}/${f}`),
            outdir: 'dist/cjs/icons',
            format: 'cjs',
            bundle: true,
            external: [...external, '../Icon'],
            target: 'es2020',
            jsx: 'automatic',
            plugins: [rewriteIconImportPlugin],
        }),
    ])
}

async function buildTypes() {
    const bundle = await rollup({
        input: 'src/index.ts',
        external,
        plugins: [dts()],
    })
    await bundle.write({
        file: 'dist/types/index.d.ts',
        format: 'esm',
    })
    await bundle.close()
}

async function build() {
    console.log('📦 Building JS (ESM + CJS)...')
    await buildJS()

    console.log('📦 Building types...')
    await buildTypes()

    console.log('✅ Build complete!')
}

build().catch(err => {
    console.error(err)
    process.exit(1)
})
