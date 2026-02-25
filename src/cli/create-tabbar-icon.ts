import * as path from 'path';
import sharp from 'sharp';
import {
  CliError,
  downloadIcon,
  ensureDir,
  normalizeIconName,
  processSvg,
  validateColor,
  validateSize,
  validateStrokeWidth,
} from './utils';

interface CreateTabbarIconOptions {
  color: string;
  activeColor?: string;
  size: string;
  output: string;
  strokeWidth: string;
}

interface GenerateResult {
  success: boolean;
  files: string[];
  error?: string;
  errorCode?: string;
}

async function svgToPng(svg: string, size: number): Promise<Buffer> {
  try {
    return await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new CliError(`SVG to PNG conversion failed: ${message}`, 'CONVERSION_ERROR');
  }
}

async function writeFile(buffer: Buffer, filePath: string): Promise<void> {
  try {
    await sharp(buffer).toFile(filePath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new CliError(`Failed to write file "${filePath}": ${message}`, 'FILE_WRITE_ERROR');
  }
}

async function generateIcon(iconName: string, options: CreateTabbarIconOptions): Promise<GenerateResult> {
  const kebabName = normalizeIconName(iconName);

  const downloadResult = await downloadIcon(iconName);
  if (!downloadResult.success) {
    return {
      success: false,
      files: [],
      error: downloadResult.error,
      errorCode: downloadResult.errorCode,
    };
  }

  const svgContent = downloadResult.content!;
  const sizeResult = validateSize(options.size);
  const strokeWidthResult = validateStrokeWidth(options.strokeWidth);
  const files: string[] = [];

  try {
    ensureDir(options.output);

    const normalSvg = processSvg(svgContent, {
      color: options.color,
      strokeWidth: strokeWidthResult.value,
      size: sizeResult.value,
    });

    const normalPng = await svgToPng(normalSvg, sizeResult.value);
    const normalPath = path.join(options.output, `${kebabName}.png`);
    await writeFile(normalPng, normalPath);
    files.push(normalPath);

    if (options.activeColor) {
      const activeSvg = processSvg(svgContent, {
        color: options.activeColor,
        strokeWidth: strokeWidthResult.value,
        size: sizeResult.value,
      });

      const activePng = await svgToPng(activeSvg, sizeResult.value);
      const activePath = path.join(options.output, `${kebabName}-active.png`);
      await writeFile(activePng, activePath);
      files.push(activePath);
    }

    return { success: true, files };
  } catch (err) {
    if (err instanceof CliError) {
      return {
        success: false,
        files,
        error: err.message,
        errorCode: err.code,
      };
    }
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      files,
      error: `Unexpected error: ${message}`,
      errorCode: 'UNKNOWN_ERROR',
    };
  }
}

function validateOptions(options: CreateTabbarIconOptions): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validateColor(options.color)) {
    errors.push(`Invalid color "${options.color}": use hex (#fff or #ffffff), rgb(), rgba(), or named color`);
  }

  if (options.activeColor && !validateColor(options.activeColor)) {
    errors.push(
      `Invalid active-color "${options.activeColor}": use hex (#fff or #ffffff), rgb(), rgba(), or named color`
    );
  }

  const sizeResult = validateSize(options.size);
  if (!sizeResult.valid) {
    errors.push(sizeResult.error!);
  }

  const strokeWidthResult = validateStrokeWidth(options.strokeWidth);
  if (!strokeWidthResult.valid) {
    errors.push(strokeWidthResult.error!);
  }

  return { valid: errors.length === 0, errors };
}

export async function createTabbarIcon(icons: string[], options: CreateTabbarIconOptions): Promise<void> {
  if (icons.length === 0) {
    console.error('Error: No icons specified.');
    console.error('');
    console.error('Usage: taro-lucide-tabbar <icons...> [options]');
    console.error('');
    console.error('Example:');
    console.error('  taro-lucide-tabbar House Settings User -c "#999" -a "#1890ff"');
    console.error('');
    console.error('Available icons: https://lucide.dev/icons');
    process.exit(1);
  }

  const validation = validateOptions(options);
  if (!validation.valid) {
    console.error('Error: Invalid options');
    console.error('');
    for (const error of validation.errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log('Creating tabbar icons...');
  console.log(`  Color: ${options.color}`);
  if (options.activeColor) {
    console.log(`  Active Color: ${options.activeColor}`);
  }
  console.log(`  Size: ${options.size}x${options.size}`);
  console.log(`  Stroke Width: ${options.strokeWidth}`);
  console.log(`  Output: ${path.resolve(options.output)}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const failedIcons: { name: string; error: string; code?: string }[] = [];

  for (const iconName of icons) {
    const result = await generateIcon(iconName, options);

    if (result.success) {
      successCount++;
      for (const file of result.files) {
        console.log(`  [OK] ${path.basename(file)}`);
      }
    } else {
      failCount++;
      console.log(`  [FAIL] ${iconName}: ${result.error}`);
      failedIcons.push({ name: iconName, error: result.error!, code: result.errorCode });
    }
  }

  console.log('');
  console.log(`Summary: ${successCount} succeeded, ${failCount} failed`);

  if (failCount > 0) {
    console.log('');
    console.log('Failed icons:');
    for (const failed of failedIcons) {
      console.log(`  - ${failed.name}: ${failed.error} (${failed.code || 'UNKNOWN'})`);
    }
    console.log('');
    console.log('Tip: Check icon names at https://lucide.dev/icons');
    process.exit(1);
  }
}


