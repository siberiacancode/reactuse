import { useEffect } from 'react';

import { useCounter } from '../useCounter/useCounter';

import { useAsyncState } from './useAsyncState';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const Demo = () => {
  const { count, dec, inc } = useCounter(1);

  const { data, error, isLoading, cancel, execute } = useAsyncState<Todo | null, [todoId: number]>(
    async (signal, todoId) => {
      const request = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}?time=${Date.now()}`,
        {
          signal
        }
      );

      if (request.status !== 200) {
        throw new Error('Failed to fetch todo data');
      }

      return request.json();
    },
    null,
    {
      // delay: 1000,
      // immediate: false,
      onSuccess(data) {
        console.log('onSuccess:', data);
      },
      onError(err) {
        console.error('onError: ', (err as Error).message);
      }
    }
  );

  useEffect(() => {
    execute(count);
  }, [count]);

  return (
    <div>
      <button onClick={() => cancel(new Error('canceled by user'))}>Cancel</button>
      <button onClick={() => dec()}>Prev</button>
      <button onClick={() => inc()}>Next</button>
      {/* <button onClick={() => execute(10)}>Load todo (10)</button> */}
      <div>
        <p>Todo: {count}</p>
        <p>Loading: {isLoading.toString()}</p>
        <p>Error: {(error as Error)?.message || ''}</p>
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Demo;
