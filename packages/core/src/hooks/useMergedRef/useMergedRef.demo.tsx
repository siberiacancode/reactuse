import { cn } from '@siberiacancode/docs/utils';
import {
  useClickOutside,
  useCounter,
  useLongPress,
  useMergedRef,
  useMouse
} from '@siberiacancode/reactuse';
import { useRef } from 'react';

const Demo = () => {
  const counter = useCounter();

  const myRef = useRef<HTMLDivElement>(null);

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    console.log('clicked outside');
    counter.inc();
  });

  useLongPress(myRef, () => {
    console.log('long pressed');
    counter.inc();
  });

  const mouseResult = useMouse();

  const mergedRef = useMergedRef(myRef, clickOutsideRef);

  return (
    <div>
      <p>
        Click more than five times: <code>{counter.value}</code>
      </p>

      <div
        ref={mergedRef}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-red-500 p-12',
          { 'border-green-500': counter.value > 5 }
        )}
      >
        <div className='flex gap-2'>
          <div>
            x: <code>{mouseResult.x}</code>
          </div>
          <div>
            y: <code>{mouseResult.y}</code>
          </div>
        </div>
        {counter.value <= 5 && 'Click outside or long press'}
        {counter.value > 5 && counter.value <= 25 && 'Nice work'}
        {counter.value > 25 && 'That are a lot of works'}
      </div>
    </div>
  );
};

export default Demo;
