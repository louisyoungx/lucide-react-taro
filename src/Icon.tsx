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

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Encode(str: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }

  let result = '';
  let i = 0;

  while (i < bytes.length) {
    const b1 = bytes[i++];
    const b2 = i < bytes.length ? bytes[i++] : 0;
    const b3 = i < bytes.length ? bytes[i++] : 0;

    result += BASE64_CHARS[b1 >> 2];
    result += BASE64_CHARS[((b1 & 3) << 4) | (b2 >> 4)];
    result += i - 2 < bytes.length ? BASE64_CHARS[((b2 & 15) << 2) | (b3 >> 6)] : '=';
    result += i - 1 < bytes.length ? BASE64_CHARS[b3 & 63] : '=';
  }

  return result;
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${base64Encode(svg)}`;
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
