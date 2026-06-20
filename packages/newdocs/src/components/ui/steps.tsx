'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const Steps = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('fd-steps', className)} data-slot='steps' {...props} />
);

const Step = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('fd-step', className)} data-slot='step' {...props} />
);

export { Step, Steps };
