'use client';

import type { ComponentProps } from 'react';

import { Tabs } from '@docs/ui/tabs';
import { useLocalStorage } from '@siberiacancode/reactuse';

type FunctionTabsProps = ComponentProps<typeof Tabs>;

export const FunctionTabs = ({ ...props }: FunctionTabsProps) => {
  const selectedInstallationTabStorage = useLocalStorage<'cli' | 'library' | 'manual'>(
    'reactuse-function-installation-tabs',
    'library'
  );

  return (
    <Tabs
      {...props}
      value={selectedInstallationTabStorage.value}
      onValueChange={(value) =>
        selectedInstallationTabStorage.set(value as 'cli' | 'library' | 'manual')
      }
    />
  );
};
