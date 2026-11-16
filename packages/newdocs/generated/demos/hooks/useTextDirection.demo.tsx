'use client'

import { useTextDirection } from '@siberiacancode/reactuse';
import { ArrowLeftRightIcon } from 'lucide-react';

const CONTENT = {
  ltr: {
    label: 'EN',
    title: 'Welcome to reactuse',
    body: 'A collection of essential React hooks for everyday development. Type-safe, tree-shakeable, and built with a focus on developer experience.',
    author: '— the reactuse team'
  },
  rtl: {
    label: 'ع',
    title: 'مرحبًا بك في reactuse',
    body: 'مجموعة من خطافات React الأساسية للتطوير اليومي. آمنة من حيث النوع، وقابلة للتشذيب، ومبنية مع التركيز على تجربة المطور.',
    author: 'فريق reactuse —'
  }
};

const Demo = () => {
  const textDirection = useTextDirection<HTMLDivElement>();
  const isRtl = textDirection.value === 'rtl';
  const content = isRtl ? CONTENT.rtl : CONTENT.ltr;

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div ref={textDirection.ref} className='bg-card flex h-72 flex-col gap-3 rounded-xl p-5'>
        <button
          className='self-start'
          data-size='sm'
          data-variant='outline'
          style={{ direction: 'ltr' }}
          type='button'
          onClick={() => textDirection.set(isRtl ? 'ltr' : 'rtl')}
        >
          <ArrowLeftRightIcon className='size-4' />
          {content.label}
        </button>

        <h3 className='text-foreground text-lg font-semibold'>{content.title}</h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>{content.body}</p>
        <span className='text-muted-foreground mt-auto text-xs'>{content.author}</span>
      </div>
    </section>
  );
};

export default Demo;
