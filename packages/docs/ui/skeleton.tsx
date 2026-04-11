import { cn } from '@docs/lib/utils';

const Skeleton = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div
      className={cn('bg-accent animate-pulse rounded-md', className)}
      data-slot='skeleton'
      {...props}
    />
  )

export { Skeleton };
