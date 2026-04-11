import { cn } from '@docs/lib/utils';
import { Loader2Icon } from 'lucide-react';

const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => (
    <Loader2Icon
      aria-label='Loading'
      className={cn('size-4 animate-spin', className)}
      role='status'
      {...props}
    />
  )

export { Spinner };
