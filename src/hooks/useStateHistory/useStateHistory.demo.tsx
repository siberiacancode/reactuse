import { useStateHistory } from './useStateHistory';

const Demo = () => {
  const stateHistory = useStateHistory<string>('reactuse');
  const onPush = () => stateHistory.set(Math.random().toString(36).substring(2, 15));

  return (
    <div>
      <div className='mb-1'>
        Current value: <code>{stateHistory.value}</code> index: <code>{stateHistory.index}</code>
      </div>

      <div className='mb-1'>
        <button type='button' onClick={() => stateHistory.back()}>
          Back
        </button>
        <button type='button' onClick={() => stateHistory.forward()}>
          Next
        </button>
        <button type='button' onClick={stateHistory.reset}>
          Reset
        </button>
        <button type='button' onClick={stateHistory.undo}>
          Undo
        </button>
        <button type='button' onClick={onPush}>
          Push
        </button>
      </div>

      <div className='mt-2'>
        <h4>History:</h4>
        <ul>
          {stateHistory.history.map((item) => (
            <li key={item}>
              <code>{item}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Demo;
