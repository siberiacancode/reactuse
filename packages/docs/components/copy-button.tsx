'use client';

import { cn } from '@docs/lib/utils';
import { Button } from '@docs/ui/button';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import * as React from 'react';

export function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value);
}

export const CopyButton = ({
  value,
  className,
  variant = 'ghost',
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
  tooltip?: string;
}) => {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(setHasCopied, 2000, false);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  return (
    <Button
      className={cn(
        'bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100',
        className
      )}
      data-copied={hasCopied}
      data-slot='copy-button'
      size='icon'
      variant={variant}
      onClick={() => {
        copyToClipboardWithMeta(value);
        setHasCopied(true);
      }}
      {...props}
    >
      <span className='sr-only'>Copy</span>
      {hasCopied ? <IconCheck /> : <IconCopy />}
    </Button>
  );
}
