import { Image } from '@tarojs/components';
import type { ImageProps } from '@tarojs/components';
import React, { CSSProperties, useMemo } from 'react';

export interface IconProps extends Omit<ImageProps, 'src' | 'style'> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  className?: string;
  style?: CSSProperties;
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const svgCache = new Map<string, string>();

export function createIcon(svgTemplate: string, iconName?: string) {
  const IconComponent: React.FC<IconProps> = ({
    size = 24,
    color,
    strokeWidth,
    absoluteStrokeWidth = false,
    className,
    style,
    ...props
  }) => {
    const src = useMemo(() => {
      const cacheKey = `${color}|${strokeWidth}|${absoluteStrokeWidth}|${size}`;
      const cached = svgCache.get(svgTemplate + cacheKey);
      if (cached) return cached;

      let svg = svgTemplate;

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
    }, [color, strokeWidth, absoluteStrokeWidth, size]);

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
