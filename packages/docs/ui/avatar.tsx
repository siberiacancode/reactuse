'use client';

import { cn } from '@docs/lib/utils';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import * as React from 'react';

const Avatar = ({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'lg' | 'sm';
}) => (
  <AvatarPrimitive.Root
    className={cn(
      'after:border-border group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten',
      className
    )}
    data-size={size}
    data-slot='avatar'
    {...props}
  />
);

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image
    className={cn('aspect-square size-full rounded-full object-cover', className)}
    data-slot='avatar-image'
    {...props}
  />
);

const AvatarFallback = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    className={cn(
      'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs',
      className
    )}
    data-slot='avatar-fallback'
    {...props}
  />
);

const AvatarBadge = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    className={cn(
      'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none',
      'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
      'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
      'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
      className
    )}
    data-slot='avatar-badge'
    {...props}
  />
);

const AvatarGroup = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
      className
    )}
    data-slot='avatar-group'
    {...props}
  />
);

const AvatarGroupCount = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
      className
    )}
    data-slot='avatar-group-count'
    {...props}
  />
);

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
