import { cn } from '@/docs/src/utils';

import { useCounter } from '../useCounter/useCounter';
import { useClickOutside } from './useClickOutside';

const Demo = () => {
  const counter = useCounter();

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    console.log('click outside');
    counter.inc();
  });

  return (
    <div>
      <p>
        Click more than five times: <code>{counter.value}</code>
      </p>

      <div
        ref={clickOutsideRef}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border border-red-500 p-12',
          { 'border-green-500': counter.value < 5 }
        )}
      >
        {counter.value <= 5 && 'Click outside'}
        {counter.value > 5 && counter.value <= 25 && 'Nice work'}
        {counter.value > 25 && 'That are a lot of clicks'}
      </div>
    </div>
  );
};

export default Demo;
