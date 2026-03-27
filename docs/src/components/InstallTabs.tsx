import React, { useMemo } from 'react';

import { CodeBlock } from '@/components/CodeBlock';
import {
  PackageManager,
  PackageManagerTabs,
  usePackageManager,
} from '@/components/PackageManagerTabs';
import { cn } from '@/lib/utils';

type InstallTabsProps = {
  packageName: string;
  className?: string;
};

function renderInstallCommand(packageManager: PackageManager, packageName: string) {
  switch (packageManager) {
    case 'pnpm':
      return `pnpm add ${packageName}`;
    case 'npm':
      return `npm install ${packageName}`;
    case 'yarn':
      return `yarn add ${packageName}`;
    case 'bun':
      return `bun add ${packageName}`;
    default:
      return '';
  }
}

export function InstallTabs({ packageName, className }: InstallTabsProps) {
  const { packageManager } = usePackageManager();

  const codeByManager = useMemo(
    () =>
      Object.fromEntries(
        (['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((manager) => [
          manager,
          renderInstallCommand(manager, packageName),
        ]),
      ) as Record<PackageManager, string>,
    [packageName],
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <PackageManagerTabs />
      <CodeBlock language="bash" code={codeByManager[packageManager]} />
    </div>
  );
}
