import { cn } from '@/src/lib/index';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={cn('bg-muted animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
