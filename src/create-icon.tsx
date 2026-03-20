import { Image } from '@tarojs/components';
import React, { useContext, useMemo } from 'react';
import { LucideTaroContext } from './context';
import type { IconProps } from './types';

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const svgCache = new Map<string, string>();

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
  }) => {
    const { defaultColor, defaultSize } = useContext(LucideTaroContext);
    const size = sizeProp ?? defaultSize ?? 24;
    const color = colorProp ?? defaultColor;

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
