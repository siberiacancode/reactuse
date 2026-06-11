'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/src/components/ui';


const FAQ = [
  {
    answer:
      'reactuse is a comprehensive collection of production-ready React hooks. It covers state management, browser APIs, sensors, DOM utilities, and more.',
    question: 'What is reactuse?'
  },
  {
    answer:
      'You can install the full package or use the CLI flow to add specific hooks. The docs also let you copy the source directly into your project.',
    question: 'How do I install reactuse?'
  },
  {
    answer:
      'Yes. The library works with Next.js, Remix, Vite, Gatsby, Astro, and other React-based environments.',
    question: 'Is reactuse compatible with modern React frameworks?'
  },
  {
    answer:
      'Yes. When you import specific hooks, only those pieces are pulled into the final bundle.',
    question: 'Are the hooks tree-shakeable?'
  },
  {
    answer:
      'Yes. reactuse is written in TypeScript and exposes type definitions for every hook and helper.',
    question: 'Is TypeScript supported?'
  },
  {
    answer:
      'You can open issues, send pull requests, and contribute new hooks, fixes, demos, and docs improvements on GitHub.',
    question: 'How can I contribute to reactuse?'
  }
];

export const LandingFaq = () => (
  <section>
    <div className='mx-auto max-w-6xl px-6 py-12 md:py-24'>
      <div className='grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16'>
        {/* ── Heading ── */}
        <div className='max-w-md'>
          <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-6xl'>
            FAQ
          </h2>
          <p className='text-muted-foreground mt-6 text-lg leading-relaxed'>
            Everything you need to know about reactuse. Can&apos;t find what you&apos;re looking
            for? Open an issue on GitHub.
          </p>
        </div>

        {/* ── Accordion ── */}
        <Accordion collapsible className='w-full' defaultValue='item-0' type='single'>
          {FAQ.map((faq, index) => {
            const value = `item-${index}`;

            return (
              <AccordionItem key={value} value={value}>
                <AccordionTrigger className='py-6 text-left text-lg font-medium hover:no-underline md:text-xl'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground max-w-2xl pb-6 text-base leading-relaxed md:text-lg'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  </section>
);