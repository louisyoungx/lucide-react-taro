import type { ImageProps } from '@tarojs/components';
import { CSSProperties } from 'react';

export interface LucideTaroConfig {
  // 用户可以通过 module augmentation 扩展此接口
  // strictProps: true;
}

export interface StrictIconProps {
  /** 传入 'inherit' 可使用 LucideTaroProvider 提供的默认尺寸 */
  size: number | 'inherit' | (string & {});
  /** 传入 'inherit' 可使用 LucideTaroProvider 提供的默认颜色 */
  color: 'inherit' | (string & {});
}

export interface DefaultIconProps {
  size?: number | string;
  color?: string;
}

/** 自定义颜色解析器：传入 color 输入，返回字面量颜色，或 undefined 表示不处理 */
export type ColorResolver = (input: string) => string | undefined;

/** 主题颜色解析配置，与 LucideTaroProvider 的相关字段保持一致 */
export interface ThemeColorConfig {
  themeColors?: Record<string, string>;
  cssVars?: Record<string, string>;
  resolveColor?: ColorResolver;
}

export type IconProps = Omit<ImageProps, 'src' | 'style'> & {
  filled?: boolean;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  className?: string;
  style?: CSSProperties;
} & (LucideTaroConfig extends { strictProps: true } ? StrictIconProps : DefaultIconProps);
