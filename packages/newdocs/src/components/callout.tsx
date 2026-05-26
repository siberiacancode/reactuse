import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert';
import { cn } from '@/src/lib/cn';

const calloutVariants = cva('mt-6 w-auto rounded-xl md:-mx-1 **:[code]:border', {
  variants: {
    variant: {
      default: '',
      info: 'bg-card text-blue-600 *:data-[slot=alert-description]:text-blue-600/90 dark:text-blue-400 dark:*:data-[slot=alert-description]:text-blue-400/90',
      warning:
        'bg-card text-amber-600 *:data-[slot=alert-description]:text-amber-600/90 dark:text-amber-400 dark:*:data-[slot=alert-description]:text-amber-400/90'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

interface CalloutProps
  extends Omit<React.ComponentProps<typeof Alert>, 'title' | 'variant'>,
    VariantProps<typeof calloutVariants> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
}

export const Callout = ({
  title,
  children,
  icon,
  className,
  variant = 'default',
  ...props
}: CalloutProps) => (
  <Alert className={cn(calloutVariants({ variant }), className)} data-variant={variant} {...props}>
    {icon}
    {title && <AlertTitle>{title}</AlertTitle>}
    <AlertDescription>{children}</AlertDescription>
  </Alert>
);
