'use client';

import { cn } from '@docs/lib/utils';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import * as React from 'react';

const DropdownMenu = ({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => <DropdownMenuPrimitive.Root data-slot='dropdown-menu' {...props} />

const DropdownMenuPortal = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) => <DropdownMenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props} />

const DropdownMenuTrigger = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => <DropdownMenuPrimitive.Trigger data-slot='dropdown-menu-trigger' {...props} />

const DropdownMenuContent = ({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground cn-menu-target z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100 data-[state=closed]:overflow-hidden',
          className
        )}
        align={align}
        data-slot='dropdown-menu-content'
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )

const DropdownMenuGroup = ({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) => <DropdownMenuPrimitive.Group data-slot='dropdown-menu-group' {...props} />

const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) => (
    <DropdownMenuPrimitive.Item
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-inset={inset}
      data-slot='dropdown-menu-item'
      data-variant={variant}
      {...props}
    />
  )

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean;
}) => (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      data-inset={inset}
      data-slot='dropdown-menu-checkbox-item'
      {...props}
    >
      <span
        className='pointer-events-none absolute right-2 flex items-center justify-center'
        data-slot='dropdown-menu-checkbox-item-indicator'
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )

const DropdownMenuRadioGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) => <DropdownMenuPrimitive.RadioGroup data-slot='dropdown-menu-radio-group' {...props} />

const DropdownMenuRadioItem = ({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean;
}) => (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-inset={inset}
      data-slot='dropdown-menu-radio-item'
      {...props}
    >
      <span
        className='pointer-events-none absolute right-2 flex items-center justify-center'
        data-slot='dropdown-menu-radio-item-indicator'
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) => (
    <DropdownMenuPrimitive.Label
      className={cn(
        'text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7',
        className
      )}
      data-inset={inset}
      data-slot='dropdown-menu-label'
      {...props}
    />
  )

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => (
    <DropdownMenuPrimitive.Separator
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      data-slot='dropdown-menu-separator'
      {...props}
    />
  )

const DropdownMenuShortcut = ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span
      className={cn(
        'text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto text-xs tracking-widest',
        className
      )}
      data-slot='dropdown-menu-shortcut'
      {...props}
    />
  )

const DropdownMenuSub = ({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) => <DropdownMenuPrimitive.Sub data-slot='dropdown-menu-sub' {...props} />

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) => (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-inset={inset}
      data-slot='dropdown-menu-sub-trigger'
      {...props}
    >
      {children}
      <ChevronRightIcon className='cn-rtl-flip ml-auto' />
    </DropdownMenuPrimitive.SubTrigger>
  )

const DropdownMenuSubContent = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground cn-menu-target z-50 min-w-[96px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg p-1 shadow-lg ring-1 duration-100',
        className
      )}
      data-slot='dropdown-menu-sub-content'
      {...props}
    />
  )

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
};
