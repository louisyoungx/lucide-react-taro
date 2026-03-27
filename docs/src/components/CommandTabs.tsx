import React, { useMemo } from 'react';

import { CodeBlock } from '@/components/CodeBlock';
import {
  PackageManager,
  PackageManagerTabs,
  usePackageManager,
} from '@/components/PackageManagerTabs';
import { cn } from '@/lib/utils';

type CommandTabsProps = {
  packageName: string;
  commands: string[];
  language?: string;
  className?: string;
};

function renderCommands(packageManager: PackageManager, packageName: string, commands: string[]) {
  switch (packageManager) {
    case 'pnpm':
      return commands.map((command) => `pnpm dlx ${packageName} ${command}`.trim()).join('\n');
    case 'npm':
      return commands
        .map((command) => `npm exec --yes --package=${packageName} ${packageName} -- ${command}`.trim())
        .join('\n');
    case 'yarn':
      return commands.map((command) => `yarn dlx ${packageName} ${command}`.trim()).join('\n');
    case 'bun':
      return commands.map((command) => `bunx ${packageName} ${command}`.trim()).join('\n');
    default:
      return '';
  }
}

export function CommandTabs({
  packageName,
  commands,
  language = 'bash',
  className,
}: CommandTabsProps) {
  const { packageManager } = usePackageManager();

  const codeByManager = useMemo(
    () =>
      Object.fromEntries(
        (['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((manager) => [
          manager,
          renderCommands(manager, packageName, commands),
        ]),
      ) as Record<PackageManager, string>,
    [commands, packageName],
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <PackageManagerTabs />
      <CodeBlock language={language} code={codeByManager[packageManager]} />
    </div>
  );
}
