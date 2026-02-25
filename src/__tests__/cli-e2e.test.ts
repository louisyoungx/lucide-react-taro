import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'

const CLI_PATH = path.join(process.cwd(), 'dist/cjs/cli/index.js')
const TEST_OUTPUT_DIR = path.join(process.cwd(), 'cli-e2e-output')

function runCli(args: string): {
    stdout: string
    stderr: string
    exitCode: number
} {
    try {
        const stdout = execSync(`node ${CLI_PATH} ${args}`, {
            encoding: 'utf-8',
            cwd: process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe'],
        })
        return { stdout, stderr: '', exitCode: 0 }
    } catch (error: unknown) {
        const execError = error as {
            stdout?: string
            stderr?: string
            status?: number
        }
        return {
            stdout: execError.stdout || '',
            stderr: execError.stderr || '',
            exitCode: execError.status || 1,
        }
    }
}

describe('CLI E2E', () => {
    beforeAll(() => {
        if (fs.existsSync(TEST_OUTPUT_DIR)) {
            fs.rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true })
        }
    })

    describe('basic generation', () => {
        it('should generate single icon with default options', () => {
            const result = runCli(`House -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('[OK] house.png')
            expect(result.stdout).toContain('1 succeeded, 0 failed')

            const outputFile = path.join(TEST_OUTPUT_DIR, 'house.png')
            expect(fs.existsSync(outputFile)).toBe(true)
            expect(fs.statSync(outputFile).size).toBeGreaterThan(0)
        })

        it('should generate multiple icons', () => {
            const result = runCli(`Star Moon Sun -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('3 succeeded, 0 failed')

            expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'star.png'))).toBe(
                true,
            )
            expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'moon.png'))).toBe(
                true,
            )
            expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'sun.png'))).toBe(
                true,
            )
        })

        it('should normalize PascalCase icon name to kebab-case filename', () => {
            const result = runCli(`ArrowRight -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('[OK] arrow-right.png')
            expect(
                fs.existsSync(path.join(TEST_OUTPUT_DIR, 'arrow-right.png')),
            ).toBe(true)
        })
    })

    describe('color options', () => {
        it('should generate icon with custom color', () => {
            const result = runCli(`Heart -c "#999999" -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('Color: #999999')
            expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'heart.png'))).toBe(
                true,
            )
        })

        it('should generate icon with active color (two files)', () => {
            const result = runCli(
                `Bell -c "#999" -a "#1890ff" -o ${TEST_OUTPUT_DIR}`,
            )

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('Active Color: #1890ff')
            expect(result.stdout).toContain('[OK] bell.png')
            expect(result.stdout).toContain('[OK] bell-active.png')

            expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'bell.png'))).toBe(
                true,
            )
            expect(
                fs.existsSync(path.join(TEST_OUTPUT_DIR, 'bell-active.png')),
            ).toBe(true)
        })

        it('should fail with invalid color format', () => {
            const result = runCli(`Camera -c "notacolor" -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain('Invalid color')
        })

        it('should fail with invalid active color format', () => {
            const result = runCli(
                `Clock -c "#999" -a "badcolor" -o ${TEST_OUTPUT_DIR}`,
            )

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain('Invalid active-color')
        })
    })

    describe('size options', () => {
        it('should generate icon with custom size', async () => {
            const result = runCli(`Zap -s 128 -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('Size: 128x128')

            const outputFile = path.join(TEST_OUTPUT_DIR, 'zap.png')
            expect(fs.existsSync(outputFile)).toBe(true)

            const metadata = await sharp(outputFile).metadata()
            expect(metadata.width).toBe(128)
            expect(metadata.height).toBe(128)
        })

        it('should fail with size below minimum (16)', () => {
            const result = runCli(`Flame -s 10 -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain('too small')
        })

        it('should fail with size above maximum (1024)', () => {
            const result = runCli(`Cloud -s 2000 -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain('too large')
        })

        it('should fail with non-numeric size', () => {
            const result = runCli(`Leaf -s abc -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain('must be a number')
        })
    })

    describe('stroke-width options', () => {
        it('should generate icon with custom stroke-width', () => {
            const result = runCli(`Bolt --stroke-width 3 -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('Stroke Width: 3')
            expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'bolt.png'))).toBe(
                true,
            )
        })

        it('should fail with stroke-width below minimum (0.5)', () => {
            const result = runCli(
                `Gift --stroke-width 0.1 -o ${TEST_OUTPUT_DIR}`,
            )

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain('too small')
        })

        it('should fail with stroke-width above maximum (5)', () => {
            const result = runCli(`Key --stroke-width 10 -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain('too large')
        })
    })

    describe('error handling', () => {
        it('should fail when no icons specified', () => {
            const result = runCli(`-o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(1)
            expect(result.stderr).toContain("missing required argument 'icons'")
        })

        it('should fail for non-existent icon', () => {
            const result = runCli(`NonExistentIcon123 -o ${TEST_OUTPUT_DIR}`)

            expect(result.exitCode).toBe(1)
            expect(result.stdout).toContain('[FAIL]')
            expect(result.stdout).toContain('0 succeeded, 1 failed')
        })

        it('should handle mixed valid and invalid icons', () => {
            const result = runCli(
                `Settings NonExistentIcon123 User -o ${TEST_OUTPUT_DIR}`,
            )

            expect(result.exitCode).toBe(1)
            expect(result.stdout).toContain('2 succeeded, 1 failed')

            expect(
                fs.existsSync(path.join(TEST_OUTPUT_DIR, 'settings.png')),
            ).toBe(true)
            expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'user.png'))).toBe(
                true,
            )
        })
    })
})
