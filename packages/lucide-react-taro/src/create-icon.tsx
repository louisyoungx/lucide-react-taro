import { Image } from '@tarojs/components';
import React, { useContext, useMemo } from 'react';
import { LucideTaroContext } from './context';
import type { IconProps } from './types';

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const svgCache = new Map<string, string>();

// Case-insensitive `var(` keyword; the fallback uses `.+` (not `[^)]+`) so a
// function-valued fallback like `var(--x, rgb(1,2,3))` is captured intact.
const cssVarPattern = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/i;

// Own-property check (not `in`) so a color like "toString"/"constructor" can't
// resolve to an inherited Object.prototype member. hasOwnProperty.call is used
// instead of Object.hasOwn for older mini-program runtimes.
function hasOwn(obj: Record<string, string>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 将 color 输入解析为字面量颜色。weapp 无法在 data-URI 的 <Image> 内解析 CSS 变量，
 * 因此在渲染时解析为字面量。字面量颜色（hex/rgb()/具名）原样透传以保持向后兼容。
 */
export function resolveIconColor(
  input: string | undefined,
  config: {
    resolveColor?: (i: string) => string | undefined;
    themeColors?: Record<string, string>;
    cssVars?: Record<string, string>;
  }
): string | undefined {
  if (!input) return input;

  const custom = config.resolveColor?.(input);
  if (typeof custom === 'string') return custom;

  const cssVarMatch = input.trim().match(cssVarPattern);
  if (cssVarMatch) {
    const [, varName, fallback] = cssVarMatch;
    const cssVars = config.cssVars;
    if (cssVars) {
      const bare = varName.replace(/^--/, '');
      if (hasOwn(cssVars, varName)) return cssVars[varName];
      if (hasOwn(cssVars, bare)) return cssVars[bare];
    }
    if (fallback !== undefined) return fallback.trim();
    return input;
  }

  if (config.themeColors && hasOwn(config.themeColors, input)) {
    return config.themeColors[input];
  }

  return input;
}

export function createIcon(svgTemplate: string, iconName?: string) {
  const IconComponent: React.FC<IconProps> = ({
    size: sizeProp,
    color: colorProp,
    filled = false,
    strokeWidth,
    absoluteStrokeWidth = false,
    className,
    style,
    ...props
  }: IconProps) => {
    const { defaultColor, defaultSize, themeColors, cssVars, resolveColor } = useContext(LucideTaroContext);
    const size = sizeProp === 'inherit' ? (defaultSize ?? 24) : (sizeProp ?? defaultSize ?? 24);
    const rawColor = (colorProp && colorProp !== 'inherit') ? colorProp : defaultColor;
    const color = resolveIconColor(rawColor, { resolveColor, themeColors, cssVars });

    const src = useMemo(() => {
      const cacheKey = `${color}|${filled}|${strokeWidth}|${absoluteStrokeWidth}|${size}`;
      const cached = svgCache.get(svgTemplate + cacheKey);
      if (cached) return cached;

      let svg = svgTemplate;

      if (filled) {
        svg = svg.replace(/fill="none"/g, 'fill="currentColor"');
        svg = svg.replace(/stroke="currentColor"/g, 'stroke="none"');
      }

      if (color) {
        svg = svg.replace(/stroke="currentColor"/g, `stroke="${color}"`);
        svg = svg.replace(/fill="currentColor"/g, `fill="${color}"`);
      }

      if (strokeWidth !== undefined) {
        const actualStrokeWidth = absoluteStrokeWidth
          ? (Number(strokeWidth) * 24) / Number(size)
          : strokeWidth;
        svg = svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${actualStrokeWidth}"`);
      }

      const result = svgToDataUrl(svg);
      svgCache.set(svgTemplate + cacheKey, result);
      return result;
    }, [color, filled, strokeWidth, absoluteStrokeWidth, size]);

    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    return (
      <Image
        src={src}
        className={className}
        style={{
          width: sizeValue,
          height: sizeValue,
          ...style,
        }}
        {...props}
      />
    );
  };

  IconComponent.displayName = iconName || 'LucideIcon';

  return IconComponent;
}
