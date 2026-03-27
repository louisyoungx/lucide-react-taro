import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

type PackageManagerContextValue = {
  packageManager: PackageManager;
  setPackageManager: (packageManager: PackageManager) => void;
};

type PackageManagerProviderProps = {
  children: React.ReactNode;
};

type PackageManagerTabsProps = {
  className?: string;
};

const PACKAGE_MANAGER_STORAGE_KEY = 'lucide-react-taro-package-manager';
const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

const PackageManagerContext = createContext<PackageManagerContextValue | null>(null);

export function PackageManagerProvider({ children }: PackageManagerProviderProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>('pnpm');

  useEffect(() => {
    const storedPackageManager = window.localStorage.getItem(PACKAGE_MANAGER_STORAGE_KEY);

    if (
      storedPackageManager &&
      PACKAGE_MANAGERS.includes(storedPackageManager as PackageManager)
    ) {
      setPackageManager(storedPackageManager as PackageManager);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PACKAGE_MANAGER_STORAGE_KEY, packageManager);
  }, [packageManager]);

  const value = useMemo(
    () => ({ packageManager, setPackageManager }),
    [packageManager],
  );

  return (
    <PackageManagerContext.Provider value={value}>
      {children}
    </PackageManagerContext.Provider>
  );
}

export function usePackageManager() {
  const context = useContext(PackageManagerContext);

  if (!context) {
    throw new Error('usePackageManager must be used within PackageManagerProvider');
  }

  return context;
}

export function PackageManagerTabs({ className }: PackageManagerTabsProps) {
  const { packageManager, setPackageManager } = usePackageManager();

  return (
    <Tabs
      value={packageManager}
      onValueChange={(value) => setPackageManager(value as PackageManager)}
      className={className}
    >
      <TabsList>
        {PACKAGE_MANAGERS.map((manager) => (
          <TabsTrigger key={manager} value={manager}>
            {manager}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
