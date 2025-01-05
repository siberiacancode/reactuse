import { useCounter } from '../useCounter/useCounter';
import { useClickOutside } from './useClickOutside';

const Demo = () => {
  const counter = useCounter();

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    console.log('click outside');
    counter.inc();
  });

  return (
    <div
      ref={clickOutsideRef}
      style={{
        width: 200,
        height: 200,
        display: 'flex',
        userSelect: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${counter.value < 5 ? 'red' : 'green'}`
      }}
    >
      <p>Click more than 5 times:</p>
      <p>
        <code>{counter.value}</code>
      </p>
    </div>
  );
};

export default Demo;
