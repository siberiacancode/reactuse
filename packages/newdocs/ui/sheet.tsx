'use client';

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { cn } from '@docs/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';

const Sheet = ({ ...props }: SheetPrimitive.Root.Props) => (
  <SheetPrimitive.Root data-slot='sheet' {...props} />
);

const SheetTrigger = ({ ...props }: SheetPrimitive.Trigger.Props) => (
  <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />
);

const SheetClose = ({ ...props }: SheetPrimitive.Close.Props) => (
  <SheetPrimitive.Close data-slot='sheet-close' {...props} />
);

const SheetPortal = ({ ...props }: SheetPrimitive.Portal.Props) => (
  <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />
);

const SheetOverlay = ({ className, ...props }: SheetPrimitive.Backdrop.Props) => (
  <SheetPrimitive.Backdrop
    className={cn(
      'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/50',
      className
    )}
    data-slot='sheet-overlay'
    {...props}
  />
);

const SheetContent = ({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: 'bottom' | 'left' | 'right' | 'top';
  showCloseButton?: boolean;
}) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Popup
      className={cn(
        'bg-background data-open:animate-in data-closed:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-closed:duration-300 data-open:duration-500',
        side === 'right' &&
          'data-open:slide-in-from-right data-closed:slide-out-to-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
        side === 'left' &&
          'data-open:slide-in-from-left data-closed:slide-out-to-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        side === 'top' &&
          'data-open:slide-in-from-top data-closed:slide-out-to-top inset-x-0 top-0 h-auto border-b',
        side === 'bottom' &&
          'data-open:slide-in-from-bottom data-closed:slide-out-to-bottom inset-x-0 bottom-0 h-auto border-t',
        className
      )}
      data-slot='sheet-content'
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetPrimitive.Close className='ring-offset-background focus:ring-ring data-open:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none'>
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Popup>
  </SheetPortal>
);

const SheetHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col gap-1.5 p-4', className)} data-slot='sheet-header' {...props} />
);

const SheetFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    data-slot='sheet-footer'
    {...props}
  />
);

const SheetTitle = ({ className, ...props }: SheetPrimitive.Title.Props) => (
  <SheetPrimitive.Title
    className={cn('text-foreground font-semibold', className)}
    data-slot='sheet-title'
    {...props}
  />
);

const SheetDescription = ({ className, ...props }: SheetPrimitive.Description.Props) => (
  <SheetPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    data-slot='sheet-description'
    {...props}
  />
);

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
};
