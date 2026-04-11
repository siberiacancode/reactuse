import { cn } from '@docs/lib/utils';

export const PageNav = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('container-wrapper scroll-mt-24', className)} {...props}>
    <div className='container flex items-center justify-between gap-4 py-4'>{children}</div>
  </div>
);
