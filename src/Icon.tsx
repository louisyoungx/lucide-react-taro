import { Image } from '@tarojs/components';
import type { ImageProps } from '@tarojs/components';
import React, { CSSProperties } from 'react';

export interface IconProps extends Omit<ImageProps, 'src' | 'style'> {
  size?: number;
  style?: CSSProperties;
}

export function createIcon(base64: string) {
  const IconComponent: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <Image
      src={base64}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
      {...props}
    />
  );
  return IconComponent;
}
