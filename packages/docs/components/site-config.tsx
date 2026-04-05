'use client';

import * as React from 'react';
import { GalleryHorizontalIcon } from 'lucide-react';

import { trackEvent } from '@docs/lib/events';
import { cn } from '@docs/lib/utils';
import { useLayout } from '@docs/hooks/use-layout';
import { Button } from '@docs/registry/new-york-v4/ui/button';

export function SiteConfig({ className }: React.ComponentProps<typeof Button>) {
  const { layout, setLayout } = useLayout();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {
        const newLayout = layout === 'fixed' ? 'full' : 'fixed';
        setLayout(newLayout);
        trackEvent({
          name: 'set_layout',
          properties: { layout: newLayout }
        });
      }}
      className={cn('size-8', className)}
      title='Toggle layout'
    >
      <span className='sr-only'>Toggle layout</span>
      <GalleryHorizontalIcon />
    </Button>
  );
}
