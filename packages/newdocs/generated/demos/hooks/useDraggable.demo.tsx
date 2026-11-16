'use client'

import { useDraggable } from '@siberiacancode/reactuse';
import { GripVerticalIcon } from 'lucide-react';
import { useRef } from 'react';

const Demo = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useDraggable(cardRef, {
    onStart: ({ event }) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-drag-handle]')) return false;
      if (cardRef.current) cardRef.current.style.transition = 'none';
    },
    onMove: ({ delta }) => {
      if (cardRef.current)
        cardRef.current.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
    },
    onEnd: () => {
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
        cardRef.current.style.transform = 'translate(0px, 0px)';
      }
    }
  });

  return (
    <section className='relative'>
      <div ref={cardRef} className='w-64 select-none' style={{ transform: 'translate(0px, 0px)' }}>
        <div className='bg-card text-card-foreground border-border rounded-xl border shadow-md'>
          <div
            data-drag-handle
            className='border-border bg-muted/50 flex cursor-grab items-center gap-2 rounded-t-xl border-b px-3 py-2 active:cursor-grabbing'
          >
            <GripVerticalIcon className='text-muted-foreground size-4' />
            <span className='text-sm font-medium'>Project Atlas</span>
          </div>
          <div className='flex flex-col gap-3 p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Design review</span>
              <span className='border-border rounded-full border px-2 py-0.5 text-xs font-medium'>
                In progress
              </span>
            </div>
            <p className='text-muted-foreground text-sm'>
              Finalize the dashboard mockups and hand off specs to engineering before Friday.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
