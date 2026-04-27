import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const iconButtonVariants = cva(
  `inline-flex shrink-0 items-center justify-center gap-2 transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5`,
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
        outline:
          'border border-ring bg-white text-foreground hover:border-action-primary hover:shadow-[-2px_2px_0px_0px_var(--color-action-primary)] disabled:border-border-hard dark:bg-secondary',
        ghost: 'text-foreground hover:bg-secondary',
        danger:
          'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/20 dark:bg-danger/60 dark:focus-visible:ring-danger/40'
      },
      size: {
        sm: `size-8`,
        md: `size-10`,
        lg: `size-13`
      },
      rounded: {
        false: 'rounded-8',
        true: 'rounded-full'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: false
    }
  }
);

const IconButton = ({
  className,
  variant = 'primary',
  size = 'md',
  rounded = false,
  asChild = false,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof iconButtonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(iconButtonVariants({ variant, size, rounded, className }))}
      data-size={size}
      data-slot='button'
      data-variant={variant}
      {...props}
    />
  );
};

export { IconButton, iconButtonVariants };
