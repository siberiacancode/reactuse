'use client';

import { useCollapse } from '@siberiacancode/reactuse';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const FAQS = [
  {
    id: 'hooks',
    question: 'How many hooks are available in reactuse?',
    answer:
      'Reactuse includes 170+ production-ready hooks for state, browser APIs, async workflows, UI interactions, sensors, and more.'
  },
  {
    id: 'use-cases',
    question: 'What can I build with reactuse?',
    answer:
      'Build forms, media experiences, browser integrations, responsive interfaces, animations, and complex state flows without rewriting common logic.'
  },
  {
    id: 'benefits',
    question: 'Why should I choose reactuse?',
    answer:
      'Every hook is TypeScript-first, SSR compatible, tree-shakable, documented, and designed for real production applications.'
  }
];

interface FAQItemProps {
  answer: string;
  id: string;
  initiallyExpanded?: boolean;
  question: string;
}

const FAQItem = ({ id, question, answer, initiallyExpanded }: FAQItemProps) => {
  const collapse = useCollapse(initiallyExpanded);

  return (
    <div className='border-border border-b last:border-b-0'>
      <button
        aria-controls={id}
        aria-expanded={collapse.expanded}
        className='flex h-auto! w-full! items-center justify-between! gap-4 rounded-none! border-0! bg-transparent! px-0! py-4! text-left! text-base! font-semibold whitespace-normal!'
        data-size='unstyled'
        data-variant='unstyled'
        type='button'
        onClick={() => collapse.toggle()}
      >
        {question}
        <ChevronDownIcon
          className={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform',
            collapse.expanded && 'rotate-180'
          )}
        />
      </button>

      <div ref={collapse.ref} aria-hidden={!collapse.expanded} id={id} inert={!collapse.expanded}>
        <p className='text-muted-foreground pb-4 text-base leading-relaxed'>{answer}</p>
      </div>
    </div>
  );
};

const Demo = () => (
  <section className='w-full max-w-lg px-4'>
    {FAQS.map((faq, index) => (
      <FAQItem key={faq.id} {...faq} initiallyExpanded={index === 0} />
    ))}
  </section>
);

export default Demo;
