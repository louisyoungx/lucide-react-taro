import * as fs from 'fs';
import * as path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.lucide-cache');
const ICONS_SOURCE_DIR = path.join(CACHE_DIR, 'icons');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'icons');

interface IconMeta {
  name: string;
  componentName: string;
  base64: string;
}

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function svgToBase64(svgContent: string): string {
  const encoded = Buffer.from(svgContent, 'utf-8').toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

function generateIconModule(icon: IconMeta): string {
  return `import { createIcon } from '../Icon';

export const ${icon.componentName} = createIcon("${icon.base64}");
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
    const base64 = svgToBase64(svgContent);

    icons.push({ name, componentName, base64 });

    const moduleContent = generateIconModule({ name, componentName, base64 });
    fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.ts`), moduleContent);
  }

  const indexContent = generateIndexFile(icons);
  fs.writeFileSync(path.join(process.cwd(), 'src', 'index.ts'), indexContent);

  console.log(`✅ Generated ${icons.length} icon modules`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

generate().catch(console.error);
