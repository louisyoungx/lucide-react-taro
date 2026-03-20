import type { ImageProps } from '@tarojs/components';
import { CSSProperties } from 'react';

export interface LucideTaroConfig {
  // 用户可以通过 module augmentation 扩展此接口
  // strictProps: true;
}

export interface StrictIconProps {
  size: number | string;
  color: string;
}

export interface DefaultIconProps {
  size?: number | string;
  color?: string;
}

export type IconProps = Omit<ImageProps, 'src' | 'style'> & {
  filled?: boolean;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  className?: string;
  style?: CSSProperties;
} & (LucideTaroConfig extends { strictProps: true } ? StrictIconProps : DefaultIconProps);
