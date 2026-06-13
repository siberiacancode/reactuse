'use client'

import { useRefState } from '@siberiacancode/reactuse';

const Demo = () => {
  const enabled = useRefState(false);

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <input
        checked={enabled.current}
        role='switch'
        type='checkbox'
        onChange={() => (enabled.current = !enabled.current)}
      />

      <span className='text-muted-foreground text-sm'>
        {enabled.current ? 'Enabled' : 'Disabled'}
      </span>
    </section>
  );
};

export default Demo;
