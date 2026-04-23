'use client';

import type { ComponentProps } from 'react';

import { Tabs } from '@docs/ui/tabs';
import { useLocalStorage } from '@siberiacancode/reactuse';

type FunctionTabsProps = ComponentProps<typeof Tabs>;

export const FunctionTabs = ({ ...props }: FunctionTabsProps) => {
  const selectedTabStorage = useLocalStorage<'cli' | 'library' | 'manual'>(
    'reactuse-function-tabs',
    'library'
  );

  return (
    <Tabs
      {...props}
      value={selectedTabStorage.value}
      onValueChange={(value) => selectedTabStorage.set(value as 'cli' | 'library' | 'manual')}
    />
  );
};
