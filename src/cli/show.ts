#!/usr/bin/env node
import { Command } from 'commander'
import { iconList } from './icon-list'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const program = new Command()

program
  .name('taro-lucide-show')
  .description('Show Lucide icon in terminal')
  .argument('<name>', 'Icon name (e.g. ArrowUp, arrow-up)')
  .option('-s, --size <number>', 'Size of the preview', '40')
  .option('-c, --color <string>', 'Color of the icon', '#ffffff')
  .action(async (name, options) => {
    const iconEntry = iconList.find(
      i => i.name === name || i.componentName === name
    )

    if (!iconEntry) {
      console.error(`Icon "${name}" not found.`)
      process.exit(1)
    }

    // Construct path to icon file.
    // We assume icons are in ../icons relative to cli folder.
    const iconsDir = path.resolve(__dirname, '../icons')
    
    let iconPath = path.join(iconsDir, `${iconEntry.name}.js`)
    if (!fs.existsSync(iconPath)) {
        iconPath = path.join(iconsDir, `${iconEntry.name}.ts`)
    }
    
    if (!fs.existsSync(iconPath)) {
        // Fallback: check if we are in dist/cjs/cli and icons are in src/icons (dev scenario)
        const srcIconsDir = path.resolve(__dirname, '../../../src/icons')
        if (fs.existsSync(path.join(srcIconsDir, `${iconEntry.name}.ts`))) {
            iconPath = path.join(srcIconsDir, `${iconEntry.name}.ts`)
        } else {
            console.error(`Icon file not found for ${name}`)
            process.exit(1)
        }
    }

    const content = fs.readFileSync(iconPath, 'utf-8')
    let svgString: string | undefined

    // Match SVG string inside quotes
    // Pattern: Quote + <svg ... </svg> + Quote
    const svgRegex = /(['"])(<svg[\s\S]*?<\/svg>)\1/
    const match = content.match(svgRegex)

    if (match) {
        const quote = match[1]
        svgString = match[2]
        if (quote === '"') {
            svgString = svgString.replace(/\\"/g, '"')
        }
    } else {
        console.error('Could not extract SVG string from file.')
        process.exit(1)
    }

    try {
      // Render with sharp
      const size = parseInt(options.size, 10)
      const color = options.color

      // Replace currentColor with specified color
      const coloredSvg = svgString
        .replace(/stroke="currentColor"/g, `stroke="${color}"`)
        .replace(/fill="currentColor"/g, `fill="${color}"`)

      const buffer = Buffer.from(coloredSvg)
      
      const { data, info } = await sharp(buffer)
        .resize(size, size)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })

      // Render to terminal using ANSI truecolor
      // We use ▀ (upper half block).
      // Foreground color = Upper pixel (y)
      // Background color = Lower pixel (y+1)
      
      for (let y = 0; y < info.height; y += 2) {
        let line = ''
        for (let x = 0; x < info.width; x++) {
          const idx1 = (y * info.width + x) * info.channels
          const r1 = data[idx1]
          const g1 = data[idx1 + 1]
          const b1 = data[idx1 + 2]
          const a1 = data[idx1 + 3]

          const idx2 = ((y + 1) * info.width + x) * info.channels
          // Check if y+1 is within bounds
          const hasLower = y + 1 < info.height
          const r2 = hasLower ? data[idx2] : 0
          const g2 = hasLower ? data[idx2 + 1] : 0
          const b2 = hasLower ? data[idx2 + 2] : 0
          const a2 = hasLower ? data[idx2 + 3] : 0

          // Determine if pixels are transparent
          const isUpperTransparent = a1 < 10
          const isLowerTransparent = hasLower && a2 < 10

          if (isUpperTransparent && (isLowerTransparent || !hasLower)) {
            line += '\x1b[0m ' // Reset and print space
          } else {
            let chunk = ''
            
            // Set foreground (upper half)
            if (!isUpperTransparent) {
                chunk += `\x1b[38;2;${r1};${g1};${b1}m`
            } else {
                // If upper is transparent, we use black as "transparent" color for FG
                // This is a limitation of ▀ char, it must have a FG color.
                chunk += `\x1b[38;2;0;0;0m`
            }

            // Set background (lower half)
            if (hasLower && !isLowerTransparent) {
                chunk += `\x1b[48;2;${r2};${g2};${b2}m`
            } else {
                chunk += `\x1b[49m` // Default background
            }
            
            chunk += '▀'
            line += chunk
          }
        }
        line += '\x1b[0m' // Reset at end of line
        console.log(line)
      }

    } catch (err) {
      console.error('Error rendering icon:', err)
      process.exit(1)
    }
  })

program.parse()
