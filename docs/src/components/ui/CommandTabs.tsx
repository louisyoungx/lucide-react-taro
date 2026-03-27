import React, { useMemo, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

type CommandTabsProps = {
  packageName: string;
  commands: string[];
  language?: string;
  className?: string;
};

const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

function renderCommands(packageManager: PackageManager, packageName: string, commands: string[]) {
  switch (packageManager) {
    case 'pnpm':
      return commands.map(command => `pnpm dlx ${packageName} ${command}`.trim()).join('\n');
    case 'npm':
      return commands
        .map(command => `npm exec --yes --package=${packageName} ${packageName} -- ${command}`.trim())
        .join('\n');
    case 'yarn':
      return commands.map(command => `yarn dlx ${packageName} ${command}`.trim()).join('\n');
    case 'bun':
      return commands.map(command => `bunx ${packageName} ${command}`.trim()).join('\n');
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
  const [activeManager, setActiveManager] = useState<PackageManager>('pnpm');

  const codeByManager = useMemo(
    () =>
      Object.fromEntries(
        PACKAGE_MANAGERS.map(manager => [
          manager,
          renderCommands(manager, packageName, commands),
        ]),
      ) as Record<PackageManager, string>,
    [commands, packageName],
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="inline-flex w-fit rounded-lg border bg-muted/30 p-1">
        {PACKAGE_MANAGERS.map(manager => (
          <button
            key={manager}
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeManager === manager
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveManager(manager)}
          >
            {manager}
          </button>
        ))}
      </div>
      <CodeBlock language={language} code={codeByManager[activeManager]} />
    </div>
  );
}
