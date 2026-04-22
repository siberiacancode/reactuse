import { cn } from '@docs/lib/utils';

import { Icons } from './icons';

interface LogoWordmarkProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const LogoWordmark = ({
  className,
  iconClassName,
  textClassName
}: LogoWordmarkProps) => {
  return (
    <span className={cn('inline-flex items-end leading-none', className)}>
      <span className={cn('font-display font-bold tracking-tight text-foreground', textClassName)}>
        react
      </span>
      <Icons.logo
        aria-hidden='true'
        className={cn(
          'mx-[0.04em] inline-block shrink-0 align-baseline text-[0.92em]',
          iconClassName
        )}
      />
    </span>
  );
};
