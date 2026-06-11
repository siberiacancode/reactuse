'use client'

import { useDocumentVisibility, useInterval } from '@siberiacancode/reactuse';
import { PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';

const SESSION_DURATION = 25 * 60;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
};

const Demo = () => {
  const [secondsLeft, setSecondsLeft] = useState(SESSION_DURATION);
  const interval = useInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000, {
    immediately: false
  });

  const documentVisibility = useDocumentVisibility((documentVisibility) => {
    if (documentVisibility === 'hidden') {
      interval.pause();
    }
  });

  const finished = secondsLeft === 0;
  const ticking = interval.active && !finished && documentVisibility === 'visible';

  const onToggle = () => {
    if (finished) return;
    interval.toggle();
  };

  const onReset = () => {
    interval.pause();
    setSecondsLeft(SESSION_DURATION);
  };

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='flex items-center gap-4'>
        <span className='text-3xl'>🍅</span>

        <span className='text-foreground font-mono text-3xl font-semibold tabular-nums'>
          {formatTime(secondsLeft)}
        </span>

        <div className='flex items-center gap-2'>
          <button data-variant='secondary' type='button' onClick={onReset}>
            <RotateCcwIcon className='size-4' />
          </button>
          <button data-variant='default' type='button' onClick={onToggle}>
            {ticking ? <PauseIcon className='size-4' /> : <PlayIcon className='size-4' />}
            {ticking ? 'Pause' : finished ? 'Done' : 'Start'}
          </button>
        </div>
      </div>

      <p className='text-muted-foreground text-xs'>Pauses automatically when you switch tabs</p>
    </section>
  );
};

export default Demo;
