import * as fs from 'fs'

const LUCIDE_CDN_BASE = 'https://unpkg.com/lucide-static/icons'

export class CliError extends Error {
    constructor(
        message: string,
        public code: string,
    ) {
        super(message)
        this.name = 'CliError'
    }
}

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

export function validateColor(color: string): boolean {
    const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/
    const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/
    const namedColors = [
        'black',
        'white',
        'red',
        'green',
        'blue',
        'yellow',
        'cyan',
        'magenta',
        'gray',
        'grey',
        'orange',
        'pink',
        'purple',
        'brown',
    ]

    return (
        hexPattern.test(color) ||
        rgbPattern.test(color) ||
        rgbaPattern.test(color) ||
        namedColors.includes(color.toLowerCase())
    )
}

export function validateSize(size: string): {
    valid: boolean
    value: number
    error?: string
} {
    const num = parseInt(size, 10)

    if (isNaN(num)) {
        return {
            valid: false,
            value: 0,
            error: `Invalid size "${size}": must be a number`,
        }
    }

    if (num < 16) {
        return {
            valid: false,
            value: num,
            error: `Size ${num} is too small: minimum is 16px`,
        }
    }

    if (num > 1024) {
        return {
            valid: false,
            value: num,
            error: `Size ${num} is too large: maximum is 1024px`,
        }
    }

    return { valid: true, value: num }
}

export function validateStrokeWidth(strokeWidth: string): {
    valid: boolean
    value: number
    error?: string
} {
    const num = parseFloat(strokeWidth)

    if (isNaN(num)) {
        return {
            valid: false,
            value: 0,
            error: `Invalid stroke-width "${strokeWidth}": must be a number`,
        }
    }

    if (num < 0.5) {
        return {
            valid: false,
            value: num,
            error: `Stroke-width ${num} is too small: minimum is 0.5`,
        }
    }

    if (num > 5) {
        return {
            valid: false,
            value: num,
            error: `Stroke-width ${num} is too large: maximum is 5`,
        }
    }

    return { valid: true, value: num }
}

export function ensureDir(dir: string): void {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new CliError(
            `Failed to create directory "${dir}": ${message}`,
            'DIR_CREATE_ERROR',
        )
    }
}

export interface DownloadResult {
    success: boolean
    content?: string
    error?: string
    errorCode?: string
}

export async function downloadIcon(iconName: string): Promise<DownloadResult> {
    const kebabName = normalizeIconName(iconName)
    const url = `${LUCIDE_CDN_BASE}/${kebabName}.svg`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    success: false,
                    error: `Icon "${iconName}" (${kebabName}) not found in Lucide library`,
                    errorCode: 'ICON_NOT_FOUND',
                }
            }
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
                errorCode: 'HTTP_ERROR',
            }
        }

        const svgContent = await response.text()

        if (!svgContent.includes('<svg')) {
            return {
                success: false,
                error: `Invalid SVG content received for "${iconName}"`,
                errorCode: 'INVALID_SVG',
            }
        }

        return { success: true, content: svgContent }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)

        if (message.includes('ENOTFOUND') || message.includes('getaddrinfo')) {
            return {
                success: false,
                error: 'Network error: Unable to connect to CDN. Please check your internet connection.',
                errorCode: 'NETWORK_ERROR',
            }
        }

        if (message.includes('ETIMEDOUT') || message.includes('timeout')) {
            return {
                success: false,
                error: 'Network error: Connection timed out. Please try again.',
                errorCode: 'TIMEOUT_ERROR',
            }
        }

        return {
            success: false,
            error: `Download failed: ${message}`,
            errorCode: 'DOWNLOAD_ERROR',
        }
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
