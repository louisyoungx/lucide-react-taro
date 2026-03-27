export type IconDefinition = {
  name: string
  componentName: string
  svgContent: string
}

export type CliOptions = Record<string, string>

export type PackageJsonLike = {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
