import { useWebWorkerCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

const sortNumbers = (numbers: number[]) => [...numbers].sort((a, b) => a - b);

const Demo = () => {
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<number[]>([]);
  const { callback, status, terminate } = useWebWorkerCallback(sortNumbers);

  const run = async () => {
    const numbers = Array.from({ length: 100_000 }, () => Math.floor(Math.random() * 1_000_000));
    setError(undefined);

    try {
      setResult(await callback(numbers));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setError(error instanceof Error ? error.message : 'The worker failed.');
    }
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='flex gap-2'>
        <button disabled={status === 'running'} type='button' onClick={() => void run()}>
          Sort 100,000 numbers
        </button>
        <button disabled={status !== 'running'} type='button' onClick={terminate}>
          Terminate
        </button>
      </div>

      <p className='text-muted-foreground text-sm'>Status: {status}</p>
      {error && <p className='text-destructive text-sm'>{error}</p>}
      {result.length > 0 && (
        <p className='text-muted-foreground text-sm'>
          First values: {result.slice(0, 5).join(', ')}
        </p>
      )}
    </section>
  );
};

export default Demo;
