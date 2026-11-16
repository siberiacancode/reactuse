'use client'

import { makeDestructurable } from '@siberiacancode/reactuse';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

const useCounter = (initialValue = 0) => {
  const [value, setValue] = useState(initialValue);

  const inc = (step = 1) => setValue((current) => current + step);
  const dec = (step = 1) => setValue((current) => current - step);

  return makeDestructurable({ value, inc, dec }, [value, { inc, dec }] as const);
};

const Demo = () => {
  const [value, handlers] = useCounter(2);

  return (
    <div className='flex flex-col items-center'>
      <div className='flex items-center gap-6'>
        <button data-size='icon' data-variant='ghost' type='button' onClick={() => handlers.dec()}>
          <MinusIcon strokeWidth={1.5} />
        </button>
        <span className='w-26 text-center text-7xl font-light tabular-nums'>{value}</span>
        <button data-size='icon' data-variant='ghost' type='button' onClick={() => handlers.inc()}>
          <PlusIcon strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default Demo;
