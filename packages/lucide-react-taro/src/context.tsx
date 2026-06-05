import React, { createContext, useMemo } from 'react';

export interface LucideTaroProviderProps {
  defaultColor?: string;
  defaultSize?: number | string;
  /** 主题 token -> 字面量颜色，例如 { primary: '#00b9ca' } */
  themeColors?: Record<string, string>;
  /** CSS 变量 -> 字面量颜色；键可带或不带前缀 '--'，例如 { '--color-primary': '#00b9ca' } */
  cssVars?: Record<string, string>;
  /** 自定义解析器，优先级最高 */
  resolveColor?: (input: string) => string | undefined;
  children: React.ReactNode;
}

export const LucideTaroContext = createContext<{
  defaultColor?: string;
  defaultSize?: number | string;
  themeColors?: Record<string, string>;
  cssVars?: Record<string, string>;
  resolveColor?: (input: string) => string | undefined;
}>({});

export const LucideTaroProvider: React.FC<LucideTaroProviderProps> = ({
  defaultColor,
  defaultSize,
  themeColors,
  cssVars,
  resolveColor,
  children,
}) => {
  const value = useMemo(
    () => ({ defaultColor, defaultSize, themeColors, cssVars, resolveColor }),
    [defaultColor, defaultSize, themeColors, cssVars, resolveColor]
  );
  return <LucideTaroContext.Provider value={value}>{children}</LucideTaroContext.Provider>;
};
