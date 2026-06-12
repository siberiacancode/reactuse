import { cn } from '@docs/lib/utils';

import { Icons } from './icons';

interface LogoWordmarkProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const LogoWordmark = ({ className, iconClassName, textClassName }: LogoWordmarkProps) => (
    <span className={cn('inline-flex items-end leading-none', className)}>
      <span className={cn('font-display text-foreground font-bold tracking-tight', textClassName)}>
        react
      </span>
      <Icons.logo
        className={cn(
          'mx-[0.04em] inline-block shrink-0 align-baseline text-[0.92em]',
          iconClassName
        )}
        aria-hidden='true'
      />
    </span>
  );
