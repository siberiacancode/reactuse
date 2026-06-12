import type { VariantProps } from 'class-variance-authority';

import { cn } from '@docs/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@docs/ui/alert';
import { cva } from 'class-variance-authority';

const calloutVariants = cva(
  'bg-surface text-surface-foreground border-surface mt-6 w-auto rounded-xl md:-mx-1 **:[code]:border',
  {
    variants: {
      variant: {
        default: '',
        info: 'border-blue-200/70 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/30',
        warning:
          'border-amber-200/70 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/30'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

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
  <Alert
    className={cn(calloutVariants({ variant }), className)}
    data-variant={variant}
    {...props}
  >
    {icon}
    {title && <AlertTitle>{title}</AlertTitle>}
    <AlertDescription className='text-card-foreground/80'>{children}</AlertDescription>
  </Alert>
);
