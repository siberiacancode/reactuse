import { useOptimistic } from './useOptimistic';

interface TestValue {
  amount: number;
  status: 'optimistic' | 'initial' | 'actual';
}

const stringifyValue = (value: any) => JSON.stringify(value, null, 2);

const Demo = () => {
  const optimistic = useOptimistic<TestValue>(
    { amount: 0, status: 'initial' },
    {
      onUpdate: (updated, current) => ({
        status: updated.status,
        amount: current.amount + updated.amount
      })
    }
  );

  const onClick = () => {
    const newValue = 1;

    const promise = new Promise<TestValue>((resolve) => {
      setTimeout(
        () =>
          resolve({
            amount: newValue,
            status: 'actual'
          }),
        2000
      );
    });

    optimistic.update(
      {
        amount: newValue,
        status: 'optimistic'
      },
      promise
    );
  };

  return (
    <>
      <button type='button' onClick={onClick}>
        Update
      </button>
      <br />
      <pre lang='json'>
        <b>Optimistic value:</b>
        <p>{stringifyValue(optimistic.value)}</p>
      </pre>
    </>
  );
};

export default Demo;
