import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const skillPlugin = (): Plugin => ({
    name: 'skill-route',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url === '/skill') {
                const skillContent = fs.readFileSync(
                    path.resolve(__dirname, '../SKILL.md'),
                    'utf-8',
                )
                res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                res.end(skillContent)
            } else {
                next()
            }
        })
    },
    generateBundle() {
        const skillContent = fs.readFileSync(
            path.resolve(__dirname, '../SKILL.md'),
            'utf-8',
        )
        this.emitFile({
            type: 'asset',
            fileName: 'skill',
            source: skillContent,
        })
    },
})

export default defineConfig({
    plugins: [react(), skillPlugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@tarojs/components': fileURLToPath(
                new URL('./src/shims/taro-components.tsx', import.meta.url),
            ),
            'lucide-react-taro': fileURLToPath(
                new URL('../packages/lucide-react-taro/src/index.ts', import.meta.url),
            ),
        },
    },
})
