import React, { createContext, useMemo } from 'react';

export interface LucideTaroProviderProps {
  defaultColor?: string;
  defaultSize?: number | string;
  children: React.ReactNode;
}

export const LucideTaroContext = createContext<{ defaultColor?: string; defaultSize?: number | string }>({});

export const LucideTaroProvider: React.FC<LucideTaroProviderProps> = ({ defaultColor, defaultSize, children }) => {
  const value = useMemo(() => ({ defaultColor, defaultSize }), [defaultColor, defaultSize]);
  return <LucideTaroContext.Provider value={value}>{children}</LucideTaroContext.Provider>;
};
