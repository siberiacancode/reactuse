'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { cn } from '@docs/lib/utils';
import type * as React from 'react';

const Popover = ({ ...props }: PopoverPrimitive.Root.Props) => (
  <PopoverPrimitive.Root data-slot='popover' {...props} />
);

const PopoverTrigger = ({ ...props }: PopoverPrimitive.Trigger.Props) => (
  <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />
);

const PopoverContent = ({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className='isolate z-50'
    >
      <PopoverPrimitive.Popup
        className={cn(
          'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden',
          className
        )}
        data-slot='popover-content'
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
);

const PopoverHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col gap-1 text-sm', className)}
    data-slot='popover-header'
    {...props}
  />
);

const PopoverTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('font-medium', className)} data-slot='popover-title' {...props} />
);

const PopoverDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn('text-muted-foreground', className)}
    data-slot='popover-description'
    {...props}
  />
);

export { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
