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
} from '../cli/utils';

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
    expect(result).toBe(mockSvg);
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

  it('should return null if fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    );

    const result = await downloadIcon('house');
    expect(result).toBeNull();
  });

  it('should return null if response is not SVG', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Not Found'),
      })
    );

    const result = await downloadIcon('nonexistent');
    expect(result).toBeNull();
  });

  it('should return null if fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const result = await downloadIcon('house');
    expect(result).toBeNull();
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
