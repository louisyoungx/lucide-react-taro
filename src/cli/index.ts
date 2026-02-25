#!/usr/bin/env node
import { Command } from 'commander'
import { createTabbarIconCommand } from './create-tabbar-icon'

const program = new Command()

program
    .name('lucide-react-taro')
    .description('CLI tools for lucide-react-taro')
    .version('1.0.0')

program.addCommand(createTabbarIconCommand)

program.parse()
