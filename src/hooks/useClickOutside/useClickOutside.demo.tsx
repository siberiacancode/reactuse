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
      <p>Click more than five times: <code>{counter.value}</code></p>


      <div
        ref={clickOutsideRef}
        style={{
          padding: '50px 25px',
          position: 'relative',
          display: 'flex',
          userSelect: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: '10px',
          alignItems: 'center',
          border: `1.5px solid ${counter.value < 5 ? 'red' : 'green'}`
        }}
      >
        {counter.value <= 5 && 'Click outside'}
        {counter.value > 5 && counter.value <= 25 && 'Nice work'}
        {counter.value > 25 && 'That are a lot of clicks'}
      </div>
    </div>

  );
};

export default Demo;
