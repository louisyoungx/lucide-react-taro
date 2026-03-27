import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const targetFiles = [
  'package.json',
  'packages/generate/package.json',
  'packages/lucide-react-taro/package.json',
  'packages/taro-lucide-tabbar/package.json',
  'packages/taro-lucide-find/package.json',
  'packages/taro-lucide-show/package.json',
]

function fail(message) {
  console.error(message)
  process.exit(1)
}

function readPackageJson(relativePath) {
  const filePath = path.join(rootDir, relativePath)
  return {
    filePath,
    relativePath,
    json: JSON.parse(fs.readFileSync(filePath, 'utf8')),
  }
}

function isSemver(value) {
  return /^\d+\.\d+\.\d+$/.test(value)
}

function bumpVersion(version, type) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/)

  if (!match) {
    fail(`Unsupported version format: ${version}`)
  }

  const [, majorText, minorText, patchText] = match
  const major = Number(majorText)
  const minor = Number(minorText)
  const patch = Number(patchText)

  switch (type) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'major':
      return `${major + 1}.0.0`
    default:
      fail(`Unknown bump type: ${type}`)
  }
}

function resolveNextVersion(currentVersion, input) {
  if (!input) {
    fail('Usage: pnpm run bump -- <patch|minor|major|x.y.z>')
  }

  if (['patch', 'minor', 'major'].includes(input)) {
    return bumpVersion(currentVersion, input)
  }

  if (!isSemver(input)) {
    fail(`Invalid version: ${input}`)
  }

  return input
}

const input = process.argv[2]
const packages = targetFiles.map(readPackageJson)
const currentVersion = packages[0].json.version

if (!currentVersion || !isSemver(currentVersion)) {
  fail(`Invalid root version: ${currentVersion}`)
}

for (const pkg of packages) {
  if (pkg.json.version !== currentVersion) {
    fail(
      `Version mismatch in ${pkg.relativePath}: expected ${currentVersion}, got ${pkg.json.version}`,
    )
  }
}

const nextVersion = resolveNextVersion(currentVersion, input)

for (const pkg of packages) {
  pkg.json.version = nextVersion
  fs.writeFileSync(pkg.filePath, `${JSON.stringify(pkg.json, null, 2)}\n`)
}

console.log(`Updated workspace package versions: ${currentVersion} -> ${nextVersion}`)
