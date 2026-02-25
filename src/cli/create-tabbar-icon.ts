import { Command } from 'commander'
import * as path from 'path'
import sharp from 'sharp'
import { downloadIcon, ensureDir, normalizeIconName, processSvg } from './utils'

interface CreateTabbarIconOptions {
    color: string
    activeColor?: string
    size: string
    output: string
    strokeWidth: string
}

async function svgToPng(svg: string, size: number): Promise<Buffer> {
    return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()
}

async function generateIcon(
    iconName: string,
    options: CreateTabbarIconOptions,
): Promise<{
    success: boolean
    files: string[]
    error?: string
    downloaded?: boolean
}> {
    const kebabName = normalizeIconName(iconName)
    const svgContent = await downloadIcon(iconName)

    if (!svgContent) {
        return {
            success: false,
            files: [],
            error: `Icon "${iconName}" (${kebabName}.svg) not found`,
        }
    }

    const size = parseInt(options.size, 10)
    const strokeWidth = parseFloat(options.strokeWidth)
    const files: string[] = []

    ensureDir(options.output)

    const normalSvg = processSvg(svgContent, {
        color: options.color,
        strokeWidth,
        size,
    })

    const normalPng = await svgToPng(normalSvg, size)
    const normalPath = path.join(options.output, `${kebabName}.png`)
    await sharp(normalPng).toFile(normalPath)
    files.push(normalPath)

    if (options.activeColor) {
        const activeSvg = processSvg(svgContent, {
            color: options.activeColor,
            strokeWidth,
            size,
        })

        const activePng = await svgToPng(activeSvg, size)
        const activePath = path.join(options.output, `${kebabName}-active.png`)
        await sharp(activePng).toFile(activePath)
        files.push(activePath)
    }

    return { success: true, files }
}

async function createTabbarIcon(
    icons: string[],
    options: CreateTabbarIconOptions,
): Promise<void> {
    if (icons.length === 0) {
        console.error('❌ No icons specified.')
        console.error(
            '   Usage: lucide-react-taro create-tabbar-icon <icons...>',
        )
        console.error(
            '   Example: lucide-react-taro create-tabbar-icon House Settings User',
        )
        process.exit(1)
    }

    console.log(`🎨 Creating tabbar icons...`)
    console.log(`   Color: ${options.color}`)
    if (options.activeColor) {
        console.log(`   Active Color: ${options.activeColor}`)
    }
    console.log(`   Size: ${options.size}x${options.size}`)
    console.log(`   Output: ${options.output}`)
    console.log('')

    let successCount = 0
    let failCount = 0

    for (const iconName of icons) {
        const result = await generateIcon(iconName, options)

        if (result.success) {
            successCount++
            for (const file of result.files) {
                console.log(`   ✅ ${path.basename(file)}`)
            }
        } else {
            failCount++
            console.log(`   ❌ ${iconName}: ${result.error}`)
        }
    }

    console.log('')
    console.log(`📊 Summary: ${successCount} succeeded, ${failCount} failed`)

    if (failCount > 0) {
        console.log('')
        console.log(
            '💡 Available icons can be found at: https://lucide.dev/icons',
        )
    }
}

export const createTabbarIconCommand = new Command('create-tabbar-icon')
    .description('Generate PNG icons for WeChat miniprogram tabbar')
    .argument('<icons...>', 'Icon names (e.g., House Settings User)')
    .option('-c, --color <color>', 'Icon color', '#000000')
    .option('-a, --active-color <color>', 'Active state icon color')
    .option(
        '-s, --size <size>',
        'Icon size in pixels (recommended: 81 for miniprogram)',
        '81',
    )
    .option('-o, --output <dir>', 'Output directory', './tabbar-icons')
    .option('--stroke-width <width>', 'Stroke width', '2')
    .action(createTabbarIcon)
