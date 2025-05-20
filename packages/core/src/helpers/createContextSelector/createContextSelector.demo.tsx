import { createContextSelector } from '@siberiacancode/reactuse';
import { useMemo, useState } from 'react';

interface CountersContextValue {
  counter1: number;
  counter2: number;
  setCounter1: (value: number) => void;
  setCounter2: (value: number) => void;
}

const { Provider, useSelector } = createContextSelector({} as CountersContextValue);

const Counter1 = () => {
  const counter1 = useSelector((state) => state.counter1);
  const setCounter1 = useSelector((state) => state.setCounter1);

  return (
    <div>
      <p>Counter 1: {counter1}</p>
      <button type='button' onClick={() => setCounter1(counter1 + 1)}>
        Increment
      </button>
    </div>
  );
};

const Counter2 = () => {
  const counter2 = useSelector((state) => state.counter2);
  const setCounter2 = useSelector((state) => state.setCounter2);

  return (
    <div>
      <p>Counter 2: {counter2}</p>
      <button type='button' onClick={() => setCounter2(counter2 + 1)}>
        Increment
      </button>
    </div>
  );
};

const Demo = () => {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  const value = useMemo(
    () => ({ counter1, setCounter1, counter2, setCounter2 }),
    [counter1, counter2]
  );

  return (
    <Provider value={value}>
      <Counter1 />
      <Counter2 />
    </Provider>
  );
};

export default Demo;
