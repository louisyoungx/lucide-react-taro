import * as fs from 'fs';
import * as path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.lucide-cache');
const ICONS_SOURCE_DIR = path.join(CACHE_DIR, 'icons');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'icons');

interface IconMeta {
  name: string;
  componentName: string;
  svgContent: string;
}

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escapeSvgForJs(svgContent: string): string {
  return svgContent
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateIconModule(icon: IconMeta): string {
  const escaped = escapeSvgForJs(icon.svgContent);
  return `import { createIcon } from '../Icon';

export const ${icon.componentName} = createIcon("${escaped}", "${icon.componentName}");
`;
}

function generateIndexFile(icons: IconMeta[]): string {
  const exports = icons.map((icon) => `export { ${icon.componentName} } from './icons/${icon.name}';`).join('\n');

  return `export { createIcon } from './Icon';
export type { IconProps } from './Icon';

${exports}
`;
}

async function generate() {
  console.log('🔧 Generating icon modules...');

  if (!fs.existsSync(ICONS_SOURCE_DIR)) {
    console.error('❌ Icons source directory not found. Run "npm run fetch-icons" first.');
    process.exit(1);
  }

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const svgFiles = fs.readdirSync(ICONS_SOURCE_DIR).filter((f) => f.endsWith('.svg'));

  const icons: IconMeta[] = [];

  for (const file of svgFiles) {
    const name = file.replace('.svg', '');
    const componentName = kebabToPascal(name);
    const svgPath = path.join(ICONS_SOURCE_DIR, file);
    const svgContent = fs.readFileSync(svgPath, 'utf-8');

    icons.push({ name, componentName, svgContent });

    const moduleContent = generateIconModule({ name, componentName, svgContent });
    fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.ts`), moduleContent);
  }

  const indexContent = generateIndexFile(icons);
  fs.writeFileSync(path.join(process.cwd(), 'src', 'index.ts'), indexContent);

  console.log(`✅ Generated ${icons.length} icon modules`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

generate().catch(console.error);
