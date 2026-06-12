'use client';

import { useDebounceState } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const DEFAULT_MARKDOWN = `# Welcome to reactuse\n\nA collection of **React hooks** for everyday tasks.\n\n## Quick start\n\nInstall via npm and you get **zero dependencies**, **TypeScript types** out of the box, and **fully tested** hooks ready to use.\n\nCheck it out at [reactuse.com](https://reactuse.com).`;

const formatInline = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

const renderMarkdown = (markdown: string) => {
  const lines = markdown.split('\n');
  const html: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) {
      html.push(`<h2>${trimmed.slice(2)}</h2>`);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      html.push(`<h3>${trimmed.slice(3)}</h3>`);
      continue;
    }

    html.push(`<p>${formatInline(trimmed)}</p>`);
  }

  return html.join('');
};

const Demo = () => {
  const [markdown, setMarkdown] = useDebounceState(DEFAULT_MARKDOWN, 400);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  return (
    <section className='flex w-full max-w-3xl flex-col gap-4 p-4'>
      <div className='block md:hidden!' data-slot='tabs'>
        <div data-slot='tabs-list'>
          <button
            data-state={tab === 'edit' ? 'active' : 'inactive'}
            data-variant='tabs-trigger'
            type='button'
            onClick={() => setTab('edit')}
          >
            Edit
          </button>
          <button
            data-state={tab === 'preview' ? 'active' : 'inactive'}
            data-variant='tabs-trigger'
            type='button'
            onClick={() => setTab('preview')}
          >
            Preview
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <textarea
          className={cn(
            'no-scrollbar h-72! resize-none font-mono! text-xs!',
            tab === 'edit' ? 'block!' : 'hidden!',
            'md:block!'
          )}
          defaultValue={DEFAULT_MARKDOWN}
          onChange={(event) => setMarkdown(event.target.value)}
        />

        <div
          className={cn(
            'bg-muted/40 prose prose-xs dark:prose-invert no-scrollbar h-72 max-w-none overflow-y-auto rounded-lg p-4 text-xs',
            tab === 'preview' ? 'block!' : 'hidden!',
            'md:block!'
          )}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      </div>
    </section>
  );
};

export default Demo;
