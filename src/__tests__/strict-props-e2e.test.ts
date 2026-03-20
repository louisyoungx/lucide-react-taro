import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const PROJECT_ROOT = process.cwd()
const TEMP_DIR = path.join(PROJECT_ROOT, 'e2e/strict-props')
const SRC_DIR = path.join(TEMP_DIR, 'src')

function runTsc(tsconfigPath: string): {
    stdout: string
    stderr: string
    exitCode: number
} {
    try {
        const stdout = execSync(`npx tsc --noEmit -p "${tsconfigPath}"`, {
            encoding: 'utf-8',
            cwd: TEMP_DIR,
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

function writeSrcFile(name: string, content: string) {
    fs.writeFileSync(path.join(SRC_DIR, name), content)
}

function writeTsconfig(include: string[]): string {
    const tsconfig = {
        compilerOptions: {
            target: 'ES2020',
            module: 'ESNext',
            moduleResolution: 'node',
            lib: ['ES2020', 'DOM'],
            jsx: 'react-jsx',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            noEmit: true,
        },
        include: include.map((f) => `src/${f}`),
    }
    const configPath = path.join(TEMP_DIR, 'tsconfig.json')
    fs.writeFileSync(configPath, JSON.stringify(tsconfig, null, 2))
    return configPath
}

function cleanSrcDir() {
    if (fs.existsSync(SRC_DIR)) {
        fs.rmSync(SRC_DIR, { recursive: true, force: true })
    }
    fs.mkdirSync(SRC_DIR, { recursive: true })
}

describe('StrictProps Type E2E', () => {
    beforeAll(() => {
        // Clean and recreate the temp project directory
        if (fs.existsSync(TEMP_DIR)) {
            fs.rmSync(TEMP_DIR, { recursive: true, force: true })
        }
        fs.mkdirSync(SRC_DIR, { recursive: true })

        // Create package.json for a real project
        fs.writeFileSync(
            path.join(TEMP_DIR, 'package.json'),
            JSON.stringify(
                {
                    name: 'strict-props-e2e-test',
                    private: true,
                    dependencies: {
                        'lucide-react-taro': 'latest',
                        react: '>=18.0.0',
                        '@tarojs/components': '>=4.0.0',
                    },
                },
                null,
                2,
            ),
        )

        // Install dependencies (use npm to avoid pnpm workspace interference)
        execSync('npm install', {
            cwd: TEMP_DIR,
            stdio: 'pipe',
        })
    }, 60_000)

    // Do NOT clean up after tests — keep temp dir for manual inspection

    it('should allow omitting color and size when strictProps is not set', () => {
        cleanSrcDir()
        writeSrcFile(
            'test-default.tsx',
            `
import { House, Settings, User } from 'lucide-react-taro';

const a = <House />;
const b = <Settings size={32} />;
const c = <User color="red" />;
`,
        )

        const configPath = writeTsconfig(['test-default.tsx'])
        const result = runTsc(configPath)

        expect(result.exitCode).toBe(0)
    })

    it('should fail when strictProps is true and both color and size are missing', () => {
        cleanSrcDir()
        writeSrcFile(
            'strict-augment.d.ts',
            `
export {};
declare module 'lucide-react-taro' {
  interface LucideTaroConfig {
    strictProps: true;
  }
}
`,
        )

        writeSrcFile(
            'test-strict-missing.tsx',
            `
import { House, Settings } from 'lucide-react-taro';

const a = <House />;
const b = <Settings />;
`,
        )

        const configPath = writeTsconfig([
            'strict-augment.d.ts',
            'test-strict-missing.tsx',
        ])
        const result = runTsc(configPath)

        expect(result.exitCode).not.toBe(0)
        expect(result.stdout).toContain('color')
        expect(result.stdout).toContain('size')
    })

    it('should compile when strictProps is true and color/size are provided', () => {
        cleanSrcDir()
        writeSrcFile(
            'strict-augment.d.ts',
            `
export {};
declare module 'lucide-react-taro' {
  interface LucideTaroConfig {
    strictProps: true;
  }
}
`,
        )

        writeSrcFile(
            'test-strict-ok.tsx',
            `
import { House, Settings, User } from 'lucide-react-taro';

const a = <House color="#333" size={24} />;
const b = <Settings color="red" size={32} />;
const c = <User color="#1890ff" size="2rem" />;
`,
        )

        const configPath = writeTsconfig([
            'strict-augment.d.ts',
            'test-strict-ok.tsx',
        ])
        const result = runTsc(configPath)

        expect(result.exitCode).toBe(0)
    })

    it('should fail when strictProps is true and only color is provided (missing size)', () => {
        cleanSrcDir()
        writeSrcFile(
            'strict-augment.d.ts',
            `
export {};
declare module 'lucide-react-taro' {
  interface LucideTaroConfig {
    strictProps: true;
  }
}
`,
        )

        writeSrcFile(
            'test-strict-no-size.tsx',
            `
import { House } from 'lucide-react-taro';

const el = <House color="red" />;
`,
        )

        const configPath = writeTsconfig([
            'strict-augment.d.ts',
            'test-strict-no-size.tsx',
        ])
        const result = runTsc(configPath)

        expect(result.exitCode).not.toBe(0)
        expect(result.stdout).toContain('size')
    })

    it('should fail when strictProps is true and only size is provided (missing color)', () => {
        cleanSrcDir()
        writeSrcFile(
            'strict-augment.d.ts',
            `
export {};
declare module 'lucide-react-taro' {
  interface LucideTaroConfig {
    strictProps: true;
  }
}
`,
        )

        writeSrcFile(
            'test-strict-no-color.tsx',
            `
import { Settings } from 'lucide-react-taro';

const el = <Settings size={24} />;
`,
        )

        const configPath = writeTsconfig([
            'strict-augment.d.ts',
            'test-strict-no-color.tsx',
        ])
        const result = runTsc(configPath)

        expect(result.exitCode).not.toBe(0)
        expect(result.stdout).toContain('color')
    })

    it('should enforce strictProps in a realistic component with mixed usage', () => {
        cleanSrcDir()
        writeSrcFile(
            'strict-augment.d.ts',
            `
export {};
declare module 'lucide-react-taro' {
  interface LucideTaroConfig {
    strictProps: true;
  }
}
`,
        )

        // A realistic page component that should compile cleanly
        writeSrcFile(
            'test-realistic-ok.tsx',
            `
import { House, Settings, User, Heart, Camera, Zap } from 'lucide-react-taro';

function TabBar() {
  const active: string = 'home';
  return (
    <>
      <House color={active === 'home' ? '#1890ff' : '#999'} size={24} />
      <Settings color={active === 'settings' ? '#1890ff' : '#999'} size={24} />
      <User color={active === 'profile' ? '#1890ff' : '#999'} size={24} />
    </>
  );
}

function IconGallery() {
  return (
    <>
      <Heart color="#ff3e98" size={32} filled />
      <Camera color="red" size={48} strokeWidth={1.5} />
      <Zap color="#faad14" size={48} strokeWidth={2} absoluteStrokeWidth />
      <House color="#333" size="2rem" className="nav-icon" style={{ marginRight: 8 }} />
    </>
  );
}
`,
        )

        // A file with errors: some icons missing required props
        writeSrcFile(
            'test-realistic-fail.tsx',
            `
import { House, Settings, Heart, Camera } from 'lucide-react-taro';

// correct
const a = <House color="#333" size={24} />;
const b = <Heart color="#ff3e98" size={32} filled />;

// missing size
const c = <Settings color="red" />;

// missing color
const d = <Camera size={48} />;

// missing both
const e = <House />;
`,
        )

        // First: the correct file alone should pass
        const okConfig = writeTsconfig([
            'strict-augment.d.ts',
            'test-realistic-ok.tsx',
        ])
        const okResult = runTsc(okConfig)
        expect(okResult.exitCode).toBe(0)

        // Second: the file with errors should fail
        const failConfig = writeTsconfig([
            'strict-augment.d.ts',
            'test-realistic-fail.tsx',
        ])
        const failResult = runTsc(failConfig)
        expect(failResult.exitCode).not.toBe(0)
        expect(failResult.stdout).toContain('color')
        expect(failResult.stdout).toContain('size')
    })
})
