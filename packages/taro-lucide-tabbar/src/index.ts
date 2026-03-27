#!/usr/bin/env node
import { Command } from 'commander'
import { createTabbarIcon } from './create-tabbar-icon'

const program = new Command()

program
    .name('taro-lucide-tabbar')
    .description('Generate PNG icons for WeChat miniprogram tabbar')
    .version('1.0.0')
    .argument('<icons...>', 'Icon names (e.g., House Settings User)')
    .option(
        '-c, --color <color>',
        'Icon color (hex, rgb, rgba, or named)',
        '#000000',
    )
    .option('-a, --active-color <color>', 'Active state icon color')
    .option(
        '-s, --size <size>',
        'Icon size in pixels, 16-1024 (recommended: 81)',
        '81',
    )
    .option('-o, --output <dir>', 'Output directory', './tabbar-icons')
    .option('--stroke-width <width>', 'Stroke width, 0.5-5 (default: 2)', '2')
    .action(createTabbarIcon)

program.parse()
