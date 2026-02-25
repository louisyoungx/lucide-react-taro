import * as fs from 'fs'

const LUCIDE_CDN_BASE = 'https://unpkg.com/lucide-static/icons'

export function pascalToKebab(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase()
}

export function kebabToPascal(str: string): string {
    return str
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
}

export function normalizeIconName(name: string): string {
    if (name.includes('-')) {
        return name.toLowerCase()
    }
    return pascalToKebab(name)
}

export function ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

export async function downloadIcon(iconName: string): Promise<string | null> {
    const kebabName = normalizeIconName(iconName)
    const url = `${LUCIDE_CDN_BASE}/${kebabName}.svg`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            return null
        }

        const svgContent = await response.text()

        if (!svgContent.includes('<svg')) {
            return null
        }

        return svgContent
    } catch {
        return null
    }
}

export function applySvgColor(svg: string, color: string): string {
    let result = svg
    result = result.replace(/stroke="currentColor"/g, `stroke="${color}"`)
    result = result.replace(/fill="currentColor"/g, `fill="${color}"`)
    return result
}

export function applySvgStrokeWidth(svg: string, strokeWidth: number): string {
    return svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
}

export function applySvgSize(svg: string, size: number): string {
    let result = svg
    result = result.replace(/width="[^"]*"/, `width="${size}"`)
    result = result.replace(/height="[^"]*"/, `height="${size}"`)
    return result
}

export function processSvg(
    svg: string,
    options: {
        color?: string
        strokeWidth?: number
        size?: number
    },
): string {
    let result = svg

    if (options.color) {
        result = applySvgColor(result, options.color)
    }

    if (options.strokeWidth !== undefined) {
        result = applySvgStrokeWidth(result, options.strokeWidth)
    }

    if (options.size !== undefined) {
        result = applySvgSize(result, options.size)
    }

    return result
}
