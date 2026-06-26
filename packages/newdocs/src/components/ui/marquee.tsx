import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
}

export const Marquee = ({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) => (
  <div
    {...props}
    className={cn(
      'group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
      {
        'flex-row': !vertical,
        'flex-col': vertical
      },
      className
    )}
  >
    {Array.from({ length: repeat })
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className={cn('flex shrink-0 justify-around gap-(--gap)', {
            'animate-marquee flex-row': !vertical,
            'animate-marquee-vertical flex-col': vertical,
            'group-hover:[animation-play-state:paused]': pauseOnHover,
            '[animation-direction:reverse]': reverse
          })}
        >
          {children}
        </div>
      ))}
  </div>
);
