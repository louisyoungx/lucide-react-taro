import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@tarojs/components': fileURLToPath(
                new URL('./src/shims/taro-components.tsx', import.meta.url),
            ),
            'lucide-react-taro': fileURLToPath(
                new URL('../src/index.ts', import.meta.url),
            ),
        },
    },
})
