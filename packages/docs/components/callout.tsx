import { cn } from '@docs/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@docs/ui/alert';

export const Callout = ({
  title,
  children,
  icon,
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode;
  variant?: 'default' | 'info' | 'warning';
}) => (
    <Alert
      className={cn(
        'bg-surface text-surface-foreground border-surface mt-6 w-auto rounded-xl md:-mx-1 **:[code]:border',
        className
      )}
      data-variant={variant}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className='text-card-foreground/80'>{children}</AlertDescription>
    </Alert>
  )
