'use client';

import { copyToClipboardWithMeta } from '@docs/components/copy-button';
import { useConfig } from '@docs/hooks/use-config';
import { Button } from '@docs/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@docs/ui/tabs';
import { IconCheck, IconCopy, IconTerminal } from '@tabler/icons-react';
import * as React from 'react';

export const CodeBlockCommand = ({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__
}: React.ComponentProps<'pre'> & {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
}) => {
  const [config, setConfig] = useConfig();

  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(setHasCopied, 2000, false);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const packageManager = config.packageManager || 'pnpm';
  const tabs = React.useMemo(
    () => ({
      pnpm: __pnpm__,
      npm: __npm__,
      yarn: __yarn__,
      bun: __bun__
    }),
    [__npm__, __pnpm__, __yarn__, __bun__]
  );

  const copyCommand = React.useCallback(() => {
    const command = tabs[packageManager];

    if (!command) {
      return;
    }

    copyToClipboardWithMeta(command);
    setHasCopied(true);
  }, [packageManager, tabs]);

  return (
    <div className='overflow-x-auto'>
      <Tabs
        className='gap-0'
        value={packageManager}
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as 'bun' | 'npm' | 'pnpm' | 'yarn'
          });
        }}
      >
        <div className='border-border/50 flex items-center gap-2 border-b px-3 py-1'>
          <div className='bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70'>
            <IconTerminal className='text-code size-3' />
          </div>
          <TabsList className='rounded-none bg-transparent p-0'>
            {Object.entries(tabs).map(([key]) => (
              <TabsTrigger
                key={key}
                className='data-[state=active]:bg-background! data-[state=active]:border-input h-7 border border-transparent pt-0.5 shadow-none!'
                value={key}
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className='no-scrollbar overflow-x-auto'>
          {Object.entries(tabs).map(([key, value]) => (
            <TabsContent key={key} className='mt-0 px-4 py-3.5' value={key}>
              <pre>
                <code className='relative font-mono text-sm leading-none' data-language='bash'>
                  {value}
                </code>
              </pre>
            </TabsContent>
          ))}
        </div>
      </Tabs>
      <Button
        className='absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100'
        data-slot='copy-button'
        size='icon'
        variant='ghost'
        onClick={copyCommand}
      >
        <span className='sr-only'>Copy</span>
        {hasCopied ? <IconCheck /> : <IconCopy />}
      </Button>
    </div>
  );
};
