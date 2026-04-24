'use client';

import * as React from 'react';

import { cn } from '@docs/lib/utils';
import { IconChevronDown } from '@tabler/icons-react';

interface FaqItem {
  answer: string;
  question: string;
}

interface LandingFaqProps {
  items: FaqItem[];
}

export const LandingFaq = ({ items }: LandingFaqProps) => {
  const [openItem, setOpenItem] = React.useState('item-0');

  return (
    <div className='w-full'>
      {items.map((faq, index) => {
        const value = `item-${index}`;
        const isOpen = openItem === value;

        return (
          <div className='border-border border-b' key={value}>
            <button
              aria-expanded={isOpen}
              className='text-foreground flex w-full items-center justify-between gap-6 py-5 text-left text-base transition-colors hover:text-[var(--brand)] md:text-lg'
              onClick={() => setOpenItem((current) => (current === value ? '' : value))}
              type='button'
            >
              <span>{faq.question}</span>
              <IconChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className='overflow-hidden'>
                <div className='text-muted-foreground pb-5 text-base leading-relaxed'>
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
