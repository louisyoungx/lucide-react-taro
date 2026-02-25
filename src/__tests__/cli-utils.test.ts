import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  pascalToKebab,
  kebabToPascal,
  normalizeIconName,
  applySvgColor,
  applySvgStrokeWidth,
  applySvgSize,
  processSvg,
  ensureDir,
  downloadIcon,
  validateColor,
  validateSize,
  validateStrokeWidth,
  CliError,
} from '../cli/utils';

describe('CliError', () => {
  it('should create error with message and code', () => {
    const error = new CliError('test message', 'TEST_CODE');
    expect(error.message).toBe('test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.name).toBe('CliError');
  });
});

describe('pascalToKebab', () => {
  it('should convert PascalCase to kebab-case', () => {
    expect(pascalToKebab('House')).toBe('house');
    expect(pascalToKebab('Settings')).toBe('settings');
    expect(pascalToKebab('ArrowRight')).toBe('arrow-right');
    expect(pascalToKebab('ChevronDown')).toBe('chevron-down');
  });

  it('should handle consecutive uppercase letters', () => {
    expect(pascalToKebab('HTMLElement')).toBe('html-element');
    expect(pascalToKebab('XMLParser')).toBe('xml-parser');
  });

  it('should handle single word', () => {
    expect(pascalToKebab('Icon')).toBe('icon');
  });

  it('should handle numbers', () => {
    expect(pascalToKebab('Icon2')).toBe('icon2');
    expect(pascalToKebab('Circle3D')).toBe('circle3-d');
  });
});

describe('kebabToPascal', () => {
  it('should convert kebab-case to PascalCase', () => {
    expect(kebabToPascal('house')).toBe('House');
    expect(kebabToPascal('arrow-right')).toBe('ArrowRight');
    expect(kebabToPascal('chevron-down')).toBe('ChevronDown');
  });

  it('should handle single word', () => {
    expect(kebabToPascal('icon')).toBe('Icon');
  });

  it('should handle multiple dashes', () => {
    expect(kebabToPascal('arrow-big-up-dash')).toBe('ArrowBigUpDash');
  });
});

describe('normalizeIconName', () => {
  it('should return lowercase kebab-case for kebab input', () => {
    expect(normalizeIconName('arrow-right')).toBe('arrow-right');
    expect(normalizeIconName('Arrow-Right')).toBe('arrow-right');
  });

  it('should convert PascalCase to kebab-case', () => {
    expect(normalizeIconName('ArrowRight')).toBe('arrow-right');
    expect(normalizeIconName('House')).toBe('house');
  });
});

describe('validateColor', () => {
  it('should accept valid hex colors', () => {
    expect(validateColor('#fff')).toBe(true);
    expect(validateColor('#FFF')).toBe(true);
    expect(validateColor('#ffffff')).toBe(true);
    expect(validateColor('#FFFFFF')).toBe(true);
    expect(validateColor('#1890ff')).toBe(true);
  });

  it('should accept valid rgb colors', () => {
    expect(validateColor('rgb(255, 255, 255)')).toBe(true);
    expect(validateColor('rgb(0,0,0)')).toBe(true);
    expect(validateColor('rgb( 128 , 128 , 128 )')).toBe(true);
  });

  it('should accept valid rgba colors', () => {
    expect(validateColor('rgba(255, 255, 255, 0.5)')).toBe(true);
    expect(validateColor('rgba(0,0,0,1)')).toBe(true);
  });

  it('should accept named colors', () => {
    expect(validateColor('black')).toBe(true);
    expect(validateColor('WHITE')).toBe(true);
    expect(validateColor('Red')).toBe(true);
  });

  it('should reject invalid colors', () => {
    expect(validateColor('#gg0000')).toBe(false);
    expect(validateColor('#12345')).toBe(false);
    expect(validateColor('notacolor')).toBe(false);
    expect(validateColor('rgb(0, 0)')).toBe(false);
    expect(validateColor('')).toBe(false);
  });
});

describe('validateSize', () => {
  it('should accept valid sizes', () => {
    expect(validateSize('81')).toEqual({ valid: true, value: 81 });
    expect(validateSize('16')).toEqual({ valid: true, value: 16 });
    expect(validateSize('1024')).toEqual({ valid: true, value: 1024 });
  });

  it('should reject non-numeric sizes', () => {
    const result = validateSize('abc');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('must be a number');
  });

  it('should reject sizes below minimum', () => {
    const result = validateSize('10');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too small');
  });

  it('should reject sizes above maximum', () => {
    const result = validateSize('2000');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too large');
  });
});

describe('validateStrokeWidth', () => {
  it('should accept valid stroke widths', () => {
    expect(validateStrokeWidth('2')).toEqual({ valid: true, value: 2 });
    expect(validateStrokeWidth('0.5')).toEqual({ valid: true, value: 0.5 });
    expect(validateStrokeWidth('5')).toEqual({ valid: true, value: 5 });
  });

  it('should reject non-numeric stroke widths', () => {
    const result = validateStrokeWidth('abc');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('must be a number');
  });

  it('should reject stroke widths below minimum', () => {
    const result = validateStrokeWidth('0.1');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too small');
  });

  it('should reject stroke widths above maximum', () => {
    const result = validateStrokeWidth('10');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too large');
  });
});

describe('ensureDir', () => {
  const testDir = path.join(process.cwd(), '.test-ensure-dir');

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create directory if it does not exist', () => {
    expect(fs.existsSync(testDir)).toBe(false);
    ensureDir(testDir);
    expect(fs.existsSync(testDir)).toBe(true);
  });

  it('should not throw if directory already exists', () => {
    fs.mkdirSync(testDir, { recursive: true });
    expect(() => ensureDir(testDir)).not.toThrow();
  });
});

describe('downloadIcon', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should download icon from CDN', async () => {
    const mockSvg = '<svg>test</svg>';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockSvg),
      })
    );

    const result = await downloadIcon('house');
    expect(result.success).toBe(true);
    expect(result.content).toBe(mockSvg);
    expect(fetch).toHaveBeenCalledWith('https://unpkg.com/lucide-static/icons/house.svg');
  });

  it('should normalize PascalCase icon name', async () => {
    const mockSvg = '<svg>test</svg>';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockSvg),
      })
    );

    await downloadIcon('ArrowRight');
    expect(fetch).toHaveBeenCalledWith('https://unpkg.com/lucide-static/icons/arrow-right.svg');
  });

  it('should return error for 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
    );

    const result = await downloadIcon('nonexistent');
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('ICON_NOT_FOUND');
    expect(result.error).toContain('not found');
  });

  it('should return error for other HTTP errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    const result = await downloadIcon('house');
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('HTTP_ERROR');
    expect(result.error).toContain('500');
  });

  it('should return error for invalid SVG content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Not Found'),
      })
    );

    const result = await downloadIcon('house');
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_SVG');
  });

  it('should return network error for connection issues', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND')));

    const result = await downloadIcon('house');
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('NETWORK_ERROR');
    expect(result.error).toContain('internet connection');
  });

  it('should return timeout error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ETIMEDOUT')));

    const result = await downloadIcon('house');
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('TIMEOUT_ERROR');
    expect(result.error).toContain('timed out');
  });

  it('should return generic error for unknown errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Unknown error')));

    const result = await downloadIcon('house');
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('DOWNLOAD_ERROR');
  });
});

describe('applySvgColor', () => {
  it('should replace stroke="currentColor"', () => {
    const svg = '<svg stroke="currentColor"><path/></svg>';
    const result = applySvgColor(svg, '#ff0000');
    expect(result).toBe('<svg stroke="#ff0000"><path/></svg>');
  });

  it('should replace fill="currentColor"', () => {
    const svg = '<svg fill="currentColor"><path/></svg>';
    const result = applySvgColor(svg, 'red');
    expect(result).toBe('<svg fill="red"><path/></svg>');
  });

  it('should replace both stroke and fill', () => {
    const svg = '<svg stroke="currentColor" fill="currentColor"><path/></svg>';
    const result = applySvgColor(svg, 'blue');
    expect(result).toBe('<svg stroke="blue" fill="blue"><path/></svg>');
  });

  it('should handle multiple occurrences', () => {
    const svg = '<svg stroke="currentColor"><path stroke="currentColor"/></svg>';
    const result = applySvgColor(svg, 'green');
    expect(result).toBe('<svg stroke="green"><path stroke="green"/></svg>');
  });
});

describe('applySvgStrokeWidth', () => {
  it('should replace stroke-width attribute', () => {
    const svg = '<svg stroke-width="2"><path/></svg>';
    const result = applySvgStrokeWidth(svg, 3);
    expect(result).toBe('<svg stroke-width="3"><path/></svg>');
  });

  it('should handle decimal values', () => {
    const svg = '<svg stroke-width="2"><path/></svg>';
    const result = applySvgStrokeWidth(svg, 1.5);
    expect(result).toBe('<svg stroke-width="1.5"><path/></svg>');
  });
});

describe('applySvgSize', () => {
  it('should replace width and height attributes', () => {
    const svg = '<svg width="24" height="24"><path/></svg>';
    const result = applySvgSize(svg, 48);
    expect(result).toBe('<svg width="48" height="48"><path/></svg>');
  });
});

describe('processSvg', () => {
  const baseSvg = '<svg width="24" height="24" stroke="currentColor" stroke-width="2"><path/></svg>';

  it('should apply all options', () => {
    const result = processSvg(baseSvg, {
      color: 'red',
      strokeWidth: 3,
      size: 48,
    });
    expect(result).toContain('stroke="red"');
    expect(result).toContain('stroke-width="3"');
    expect(result).toContain('width="48"');
    expect(result).toContain('height="48"');
  });

  it('should apply only color', () => {
    const result = processSvg(baseSvg, { color: 'blue' });
    expect(result).toContain('stroke="blue"');
    expect(result).toContain('stroke-width="2"');
  });

  it('should apply only strokeWidth', () => {
    const result = processSvg(baseSvg, { strokeWidth: 4 });
    expect(result).toContain('stroke="currentColor"');
    expect(result).toContain('stroke-width="4"');
  });

  it('should return unchanged SVG when no options', () => {
    const result = processSvg(baseSvg, {});
    expect(result).toBe(baseSvg);
  });
});
