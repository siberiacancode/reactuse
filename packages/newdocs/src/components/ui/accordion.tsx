'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Accordion = ({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
  <AccordionPrimitive.Root
    className={cn('flex w-full flex-col', className)}
    data-slot='accordion'
    {...props}
  />
);

const AccordionItem = ({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item
    className={cn('not-last:border-b', className)}
    data-slot='accordion-item'
    {...props}
  />
);

const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      className={cn(
        'group/accordion-trigger focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4',
        className
      )}
      data-slot='accordion-trigger'
      {...props}
    >
      {children}
      <ChevronDownIcon
        className='pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden'
        data-slot='accordion-trigger-icon'
      />
      <ChevronUpIcon
        className='pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline'
        data-slot='accordion-trigger-icon'
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

const AccordionContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className='data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden text-sm'
    data-slot='accordion-content'
    {...props}
  >
    <div
      className={cn(
        '[&_a]:hover:text-foreground pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4',
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
);

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
