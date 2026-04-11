'use client';

import { cn } from '@docs/lib/utils';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import * as React from 'react';

const Separator = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) => (
    <SeparatorPrimitive.Root
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  )

export { Separator };
