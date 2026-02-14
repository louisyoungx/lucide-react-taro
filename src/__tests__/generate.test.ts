import { describe, it, expect } from 'vitest'

function kebabToPascal(str: string): string {
    return str
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
}

function escapeSvgForJs(svgContent: string): string {
    return svgContent
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '')
        .replace(/\r/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

describe('kebabToPascal', () => {
    it('should convert single word', () => {
        expect(kebabToPascal('home')).toBe('Home')
    })

    it('should convert two words', () => {
        expect(kebabToPascal('arrow-left')).toBe('ArrowLeft')
    })

    it('should convert multiple words', () => {
        expect(kebabToPascal('arrow-up-right')).toBe('ArrowUpRight')
    })

    it('should handle numbers', () => {
        expect(kebabToPascal('arrow-down-0-1')).toBe('ArrowDown01')
    })

    it('should handle single character parts', () => {
        expect(kebabToPascal('a-arrow-down')).toBe('AArrowDown')
    })

    it('should convert complex icon names', () => {
        expect(kebabToPascal('align-horizontal-distribute-center')).toBe(
            'AlignHorizontalDistributeCenter',
        )
    })
})

describe('escapeSvgForJs', () => {
    it('should escape backslashes', () => {
        const input = 'path\\to\\file'
        expect(escapeSvgForJs(input)).toBe('path\\\\to\\\\file')
    })

    it('should escape double quotes', () => {
        const input = '<svg width="24">'
        expect(escapeSvgForJs(input)).toBe('<svg width=\\"24\\">')
    })

    it('should remove newlines', () => {
        const input = '<svg>\n<path/>\n</svg>'
        expect(escapeSvgForJs(input)).toBe('<svg><path/></svg>')
    })

    it('should remove carriage returns', () => {
        const input = '<svg>\r\n<path/>\r\n</svg>'
        expect(escapeSvgForJs(input)).toBe('<svg><path/></svg>')
    })

    it('should collapse multiple spaces', () => {
        const input = '<svg>   <path/>   </svg>'
        expect(escapeSvgForJs(input)).toBe('<svg> <path/> </svg>')
    })

    it('should trim leading and trailing whitespace', () => {
        const input = '  <svg><path/></svg>  '
        expect(escapeSvgForJs(input)).toBe('<svg><path/></svg>')
    })

    it('should handle complex SVG content', () => {
        const input = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <circle cx="12" cy="12" r="10"/>
    </svg>`
        const expected =
            '<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\"> <circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/> </svg>'
        expect(escapeSvgForJs(input)).toBe(expected)
    })
})

describe('Icon module generation', () => {
    function generateIconModule(icon: {
        name: string
        componentName: string
        svgContent: string
    }): string {
        const escaped = escapeSvgForJs(icon.svgContent)
        return `import { createIcon } from '../Icon';

export const ${icon.componentName} = createIcon("${escaped}", "${icon.componentName}");
`
    }

    it('should generate valid module code', () => {
        const icon = {
            name: 'arrow-left',
            componentName: 'ArrowLeft',
            svgContent: '<svg width="24"><path/></svg>',
        }
        const result = generateIconModule(icon)
        expect(result).toContain("import { createIcon } from '../Icon';")
        expect(result).toContain('export const ArrowLeft = createIcon(')
        expect(result).toContain('"ArrowLeft"')
    })

    it('should properly escape SVG in module', () => {
        const icon = {
            name: 'test-icon',
            componentName: 'TestIcon',
            svgContent: '<svg width="24" height="24"><path d="M1 2"/></svg>',
        }
        const result = generateIconModule(icon)
        expect(result).toContain('width=\\"24\\"')
        expect(result).toContain('height=\\"24\\"')
        expect(result).toContain('d=\\"M1 2\\"')
    })
})

describe('Index file generation', () => {
    function generateIndexFile(
        icons: { name: string; componentName: string }[],
    ): string {
        const exports = icons
            .map(
                icon =>
                    `export { ${icon.componentName} } from './icons/${icon.name}';`,
            )
            .join('\n')
        return `export { createIcon } from './Icon';
export type { IconProps } from './Icon';

${exports}
`
    }

    it('should generate index with createIcon export', () => {
        const result = generateIndexFile([])
        expect(result).toContain("export { createIcon } from './Icon';")
        expect(result).toContain("export type { IconProps } from './Icon';")
    })

    it('should generate exports for all icons', () => {
        const icons = [
            { name: 'arrow-left', componentName: 'ArrowLeft' },
            { name: 'arrow-right', componentName: 'ArrowRight' },
        ]
        const result = generateIndexFile(icons)
        expect(result).toContain(
            "export { ArrowLeft } from './icons/arrow-left';",
        )
        expect(result).toContain(
            "export { ArrowRight } from './icons/arrow-right';",
        )
    })

    it('should handle empty icon list', () => {
        const result = generateIndexFile([])
        expect(result).toContain("export { createIcon } from './Icon';")
        expect(
            result.split('\n').filter(line => line.includes('./icons/')).length,
        ).toBe(0)
    })
})
