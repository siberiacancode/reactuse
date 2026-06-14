'use client'

import { useScrollIntoView } from '@siberiacancode/reactuse';
import { CheckIcon, ClockIcon, SparklesIcon, UserIcon } from 'lucide-react';

const INTRO = [
  'Another week, another batch of releases. We shipped a few new hooks, cleaned up the docs and finally landed the thing half of you have been asking for in the issues.',
  'But before the headline, a quick housekeeping note — the playground now runs on the latest build, so if something looked off yesterday, give it another try today.',
  'Alright, enough warm-up. Scroll past this and you will find what actually changed.'
];

const OUTRO = [
  'As always, everything is typed end to end, tree-shakeable, and covered by tests before it reaches a release.',
  'Thanks to everyone who opened an issue or a PR this cycle — half of these changes came straight from your feedback.',
  'See you in the next one. Stars on the repo are always appreciated and genuinely help other people find the project.'
];

const RELEASE_NOTES = [
  'Three new scroll hooks — useScroll, useScrollTo and useScrollIntoView',
  'Snapshot API so callbacks run without triggering rerenders',
  'Smaller bundle after dropping a couple of internal deps',
  'Docs playground rebuilt on the latest design system'
];

const Demo = () => {
  const scrollIntoView = useScrollIntoView<HTMLDivElement>({ behavior: 'smooth', block: 'center' });

  return (
    <section className='flex min-w-xs flex-col gap-4 md:min-w-md'>
      <div className='relative overflow-hidden rounded-xl'>
        <div className='no-scrollbar flex h-96 flex-col gap-5 overflow-y-auto p-5'>
          <header className='flex flex-col gap-2'>
            <h1 className='text-foreground text-2xl leading-tight font-semibold'>
              reactuse changelog — June
            </h1>
            <div className='text-muted-foreground flex items-center gap-3 text-sm'>
              <span className='flex items-center gap-1.5'>
                <UserIcon className='size-3.5' />
                debabin
              </span>
              <span className='flex items-center gap-1.5'>
                <ClockIcon className='size-3.5' />2 min read
              </span>
            </div>
          </header>

          <article className='flex flex-col gap-4'>
            {INTRO.map((text, index) => (
              <p key={index} className='text-foreground text-base leading-relaxed'>
                {text}
              </p>
            ))}
          </article>

          <div
            ref={scrollIntoView.ref}
            className='bg-muted text-foreground flex flex-col gap-3 rounded-lg p-4'
          >
            <span className='flex items-center gap-1.5 text-base font-semibold'>
              <SparklesIcon className='size-4' />
              What's new in this release
            </span>
            <ul className='flex flex-col gap-2 text-base leading-relaxed'>
              {RELEASE_NOTES.map((note, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <CheckIcon className='text-primary mt-1 size-4 shrink-0' />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <article className='flex flex-col gap-4'>
            {OUTRO.map((text, index) => (
              <p key={index} className='text-foreground text-base leading-relaxed'>
                {text}
              </p>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
};

export default Demo;
