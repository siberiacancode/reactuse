'use client'

import {
  useClickOutside,
  useDebounceCallback,
  useDisclosure,
  useStateHistory
} from '@siberiacancode/reactuse';
import { CheckIcon, HistoryIcon } from 'lucide-react';
import { useState } from 'react';

const INITIAL = 'Ship faster with reactuse — a collection of essential React hooks.';

const Demo = () => {
  const stateHistory = useStateHistory(INITIAL);
  const [text, setText] = useState(INITIAL);

  const menu = useDisclosure();
  const menuRef = useClickOutside<HTMLDivElement>(() => menu.close());

  const save = useDebounceCallback((value: string) => {
    stateHistory.set(value);
  }, 800);

  const onChange = (value: string) => {
    setText(value);

    save(value);
  };

  const jumpTo = (target: number) => {
    const delta = target - stateHistory.index;
    if (delta < 0) stateHistory.back(-delta);
    if (delta > 0) stateHistory.forward(delta);
    setText(stateHistory.history[target]);
    menu.close();
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-2 p-4'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-sm font-medium'>Draft</span>

        <div className='relative'>
          <button
            aria-expanded={menu.opened}
            data-size='sm'
            data-variant='ghost'
            type='button'
            onClick={() => menu.toggle()}
          >
            <HistoryIcon className='size-3.5' />
            History
          </button>

          {menu.opened && (
            <div
              ref={menuRef}
              className='absolute top-full right-0 z-10 mt-2 w-72'
              data-slot='dropdown-menu-content'
            >
              <div data-slot='dropdown-menu-label'>Version history</div>
              <div className='no-scrollbar max-h-56 overflow-y-auto'>
                {stateHistory.history.map((version, index) => {
                  const active = index === stateHistory.index;
                  return (
                    <div key={index} data-slot='dropdown-menu-item' onClick={() => jumpTo(index)}>
                      <span className='text-muted-foreground w-8 shrink-0 text-xs tabular-nums'>
                        v{index + 1}
                      </span>
                      <span className='truncate'>{version || 'Empty'}</span>
                      {active && <CheckIcon className='text-primary ml-auto size-4 shrink-0' />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <textarea
        className='no-scrollbar min-h-40 resize-none'
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
    </section>
  );
};

export default Demo;
