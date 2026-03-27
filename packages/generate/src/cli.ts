import { buildCli } from './commands/build-cli'
import { buildLib } from './commands/build-lib'
import { fetchIcons } from './commands/fetch-icons'
import { generateIcons } from './commands/generate-icons'
import { fail, parseArgs, requireOption, resolvePackageDir } from './utils/args'

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2))

  if (!command) {
    fail(
      'Usage: lucide-react-taro-generate <fetch-icons|generate-icons|build-lib|build-cli> --package-dir <dir> [options]',
    )
  }

  const packageDir = resolvePackageDir(requireOption(options, 'package-dir'))

  switch (command) {
    case 'fetch-icons':
      await fetchIcons(packageDir)
      break
    case 'generate-icons':
      await generateIcons(packageDir)
      break
    case 'build-lib':
      await buildLib(packageDir)
      break
    case 'build-cli':
      await buildCli(
        packageDir,
        requireOption(options, 'entry'),
        requireOption(options, 'outfile'),
      )
      break
    default:
      fail(`Unknown command: ${command}`)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
