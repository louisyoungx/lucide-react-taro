// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const PROJECT_ROOT = process.cwd()
const TEMP_DIR = path.join(PROJECT_ROOT, 'e2e/tree-shaking')
const DIST_ESM = path.join(PROJECT_ROOT, 'dist/esm/index.js')

function bundleWithEsbuild(entryContent: string, filename: string) {
    const entryPath = path.join(TEMP_DIR, filename)
    const outPath = path.join(TEMP_DIR, `out-${filename.replace('.tsx', '.js')}`)

    fs.writeFileSync(entryPath, entryContent)

    const aliasFlag = `--alias:lucide-react-taro=${path.join(PROJECT_ROOT, 'dist/esm/index.js')}`

    execSync(
        `npx esbuild "${entryPath}" --bundle --outfile="${outPath}" ` +
            `--format=esm --target=es2020 --jsx=automatic --tree-shaking=true ` +
            `--external:react --external:react/jsx-runtime --external:@tarojs/components ` +
            `"${aliasFlag}"`,
        { cwd: PROJECT_ROOT, stdio: 'pipe' },
    )

    return {
        path: outPath,
        content: fs.readFileSync(outPath, 'utf-8'),
        size: fs.statSync(outPath).size,
    }
}

describe('Tree-shaking E2E', () => {
    beforeAll(() => {
        // Ensure dist exists
        if (!fs.existsSync(DIST_ESM)) {
            throw new Error(
                'dist/esm/index.js not found. Run `npm run build` first.',
            )
        }

        if (fs.existsSync(TEMP_DIR)) {
            fs.rmSync(TEMP_DIR, { recursive: true, force: true })
        }
        fs.mkdirSync(TEMP_DIR, { recursive: true })
    })

    it('should have a significantly smaller bundle when importing only a few icons', () => {
        const fullBundleSize = fs.statSync(DIST_ESM).size

        const result = bundleWithEsbuild(
            `
import { House, Star } from 'lucide-react-taro';
export { House, Star };
`,
            'few-icons.tsx',
        )

        // Importing 2 out of 1700+ icons should be <10% of full bundle
        const ratio = result.size / fullBundleSize
        console.log(
            `Full bundle: ${fullBundleSize} bytes, ` +
            `Tree-shaken (2 icons): ${result.size} bytes, ` +
            `Ratio: ${(ratio * 100).toFixed(1)}%`,
        )

        expect(ratio).toBeLessThan(0.1)
    })

    it('should include only the imported icons in the output', () => {
        const result = bundleWithEsbuild(
            `
import { House, Star } from 'lucide-react-taro';
export { House, Star };
`,
            'included-icons.tsx',
        )

        // Imported icons should be present (check their icon name strings)
        expect(result.content).toContain('House')
        expect(result.content).toContain('Star')
    })

    it('should NOT include unused icons in the output', () => {
        const result = bundleWithEsbuild(
            `
import { House, Star } from 'lucide-react-taro';
export { House, Star };
`,
            'excluded-icons.tsx',
        )

        // These icons were NOT imported — their unique name strings should be absent.
        // We check for the icon name passed as 2nd arg to createIcon("...", "Ambulance")
        //  which esbuild will retain as a string literal if included.
        expect(result.content).not.toContain('"Ambulance"')
        expect(result.content).not.toContain('"Anchor"')
        expect(result.content).not.toContain('"Angry"')
        expect(result.content).not.toContain('"Zap"')
        expect(result.content).not.toContain('"Camera"')
    })

    it('should tree-shake when importing many but not all icons', () => {
        const fullBundleSize = fs.statSync(DIST_ESM).size

        const result = bundleWithEsbuild(
            `
import { House, Star, Moon, Sun, Heart, Settings, User, Bell, Zap, Camera } from 'lucide-react-taro';
export { House, Star, Moon, Sun, Heart, Settings, User, Bell, Zap, Camera };
`,
            'ten-icons.tsx',
        )

        // 10 icons out of 1700+ should still be well under 10%
        const ratio = result.size / fullBundleSize
        console.log(
            `Full bundle: ${fullBundleSize} bytes, ` +
            `Tree-shaken (10 icons): ${result.size} bytes, ` +
            `Ratio: ${(ratio * 100).toFixed(1)}%`,
        )

        expect(ratio).toBeLessThan(0.1)

        // Imported icons present
        expect(result.content).toContain('"House"')
        expect(result.content).toContain('"Heart"')
        expect(result.content).toContain('"Camera"')

        // Unimported icons absent
        expect(result.content).not.toContain('"Ambulance"')
        expect(result.content).not.toContain('"Anchor"')
        expect(result.content).not.toContain('"Album"')
    })

    it('should tree-shake with deep import paths (icons/*)', () => {
        const fullBundleSize = fs.statSync(DIST_ESM).size

        const outPath = path.join(TEMP_DIR, 'out-deep-import.js')
        const entryPath = path.join(TEMP_DIR, 'deep-import.tsx')

        fs.writeFileSync(
            entryPath,
            `
import { House } from 'lucide-react-taro/icons/house';
import { Star } from 'lucide-react-taro/icons/star';
export { House, Star };
`,
        )

        const houseAlias = `--alias:lucide-react-taro/icons/house=${path.join(PROJECT_ROOT, 'dist/esm/icons/house.js')}`
        const starAlias = `--alias:lucide-react-taro/icons/star=${path.join(PROJECT_ROOT, 'dist/esm/icons/star.js')}`
        const barrelAlias = `--alias:lucide-react-taro=${path.join(PROJECT_ROOT, 'dist/esm/index.js')}`

        execSync(
            `npx esbuild "${entryPath}" --bundle --outfile="${outPath}" ` +
                `--format=esm --target=es2020 --jsx=automatic --tree-shaking=true ` +
                `--external:react --external:react/jsx-runtime --external:@tarojs/components ` +
                `"${houseAlias}" "${starAlias}" "${barrelAlias}"`,
            { cwd: PROJECT_ROOT, stdio: 'pipe' },
        )

        const content = fs.readFileSync(outPath, 'utf-8')
        const size = fs.statSync(outPath).size

        const ratio = size / fullBundleSize
        console.log(
            `Full bundle: ${fullBundleSize} bytes, ` +
            `Deep import (2 icons): ${size} bytes, ` +
            `Ratio: ${(ratio * 100).toFixed(1)}%`,
        )

        expect(ratio).toBeLessThan(0.05)
        expect(content).toContain('House')
        expect(content).toContain('Star')
        expect(content).not.toContain('"Ambulance"')
    })

    it('should produce similar sizes for barrel vs deep imports of the same icons', () => {
        const barrelResult = bundleWithEsbuild(
            `
import { House, Star } from 'lucide-react-taro';
export { House, Star };
`,
            'barrel-vs-deep-barrel.tsx',
        )

        const deepEntryPath = path.join(TEMP_DIR, 'barrel-vs-deep-deep.tsx')
        const deepOutPath = path.join(TEMP_DIR, 'out-barrel-vs-deep-deep.js')

        fs.writeFileSync(
            deepEntryPath,
            `
import { House } from 'lucide-react-taro/icons/house';
import { Star } from 'lucide-react-taro/icons/star';
export { House, Star };
`,
        )

        const houseAlias = `--alias:lucide-react-taro/icons/house=${path.join(PROJECT_ROOT, 'dist/esm/icons/house.js')}`
        const starAlias = `--alias:lucide-react-taro/icons/star=${path.join(PROJECT_ROOT, 'dist/esm/icons/star.js')}`
        const barrelAlias = `--alias:lucide-react-taro=${path.join(PROJECT_ROOT, 'dist/esm/index.js')}`

        execSync(
            `npx esbuild "${deepEntryPath}" --bundle --outfile="${deepOutPath}" ` +
                `--format=esm --target=es2020 --jsx=automatic --tree-shaking=true ` +
                `--external:react --external:react/jsx-runtime --external:@tarojs/components ` +
                `"${houseAlias}" "${starAlias}" "${barrelAlias}"`,
            { cwd: PROJECT_ROOT, stdio: 'pipe' },
        )

        const deepSize = fs.statSync(deepOutPath).size

        // Barrel import with tree-shaking should be within 2x of deep import
        // (some overhead from barrel re-exports is acceptable)
        const sizeRatio = barrelResult.size / deepSize
        console.log(
            `Barrel import: ${barrelResult.size} bytes, ` +
            `Deep import: ${deepSize} bytes, ` +
            `Ratio: ${sizeRatio.toFixed(2)}x`,
        )

        expect(sizeRatio).toBeLessThan(2)
    })
})
