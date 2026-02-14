import { Image } from '@tarojs/components';
import type { ImageProps } from '@tarojs/components';
import React, { useMemo, CSSProperties } from 'react';

export interface IconProps extends Omit<ImageProps, 'src' | 'style'> {
  icon: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

const b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function customBtoa(input: string): string {
  let output = '';
  for (let i = 0; i < input.length; ) {
    const a = input.charCodeAt(i++);
    const b = input.charCodeAt(i++);
    const c = input.charCodeAt(i++);
    const bitmap = (a << 16) | ((b || 0) << 8) | (c || 0);
    output +=
      b64chars.charAt((bitmap >> 18) & 63) +
      b64chars.charAt((bitmap >> 12) & 63) +
      (isNaN(b) ? '=' : b64chars.charAt((bitmap >> 6) & 63)) +
      (isNaN(c) ? '=' : b64chars.charAt(bitmap & 63));
  }
  return output;
}

function customAtob(input: string): string {
  const str = input.replace(/=+$/, '');
  let output = '';
  for (let i = 0; i < str.length; ) {
    const a = b64chars.indexOf(str.charAt(i++));
    const b = b64chars.indexOf(str.charAt(i++));
    const c = b64chars.indexOf(str.charAt(i++));
    const d = b64chars.indexOf(str.charAt(i++));
    const bitmap = (a << 18) | (b << 12) | (c << 6) | d;
    output += String.fromCharCode((bitmap >> 16) & 255);
    if (c !== 64) output += String.fromCharCode((bitmap >> 8) & 255);
    if (d !== 64) output += String.fromCharCode(bitmap & 255);
  }
  return output;
}

function applyColor(base64Src: string, color: string): string {
  try {
    const base64Data = base64Src.replace('data:image/svg+xml;base64,', '');
    const svgString = customAtob(base64Data);
    const coloredSvg = svgString.replace(/stroke="[^"]*"/g, `stroke="${color}"`);
    return `data:image/svg+xml;base64,${customBtoa(coloredSvg)}`;
  } catch {
    return base64Src;
  }
}

export const Icon: React.FC<IconProps> = ({ icon, size = 24, color, style, ...props }) => {
  const iconSrc = useMemo(() => (color ? applyColor(icon, color) : icon), [icon, color]);

  const imageStyle = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      ...style,
    }),
    [size, style]
  );

  return <Image src={iconSrc} style={imageStyle} {...props} />;
};
