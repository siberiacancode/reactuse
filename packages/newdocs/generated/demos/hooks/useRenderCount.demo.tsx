'use client'

import { useRenderCount } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const renderCount = useRenderCount();
  const [value, setValue] = useState('');

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <div className='relative rounded-xl border-2 border-green-500 p-3 transition-colors duration-300'>
        <span className='absolute -top-3 left-3 rounded-full bg-green-500 px-2 py-0.5 font-mono text-[10px] font-semibold text-white tabular-nums'>
          ×{renderCount}
        </span>

        <input
          placeholder='Type to re-render…'
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </section>
  );
};

export default Demo;
