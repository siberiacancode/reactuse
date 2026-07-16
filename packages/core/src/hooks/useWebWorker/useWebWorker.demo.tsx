import { useWebWorker } from '@siberiacancode/reactuse';
import { useState } from 'react';

const WORKER_URL = `data:text/javascript;charset=utf-8,${encodeURIComponent(`
const isPrime = (value) => {
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return value > 1;
};

self.addEventListener('message', (event) => {
  const limit = Math.max(2, Number(event.data));
  const notifyEvery = Math.max(1, Math.floor(limit / 100));
  let primes = 0;

  for (let value = 2; value <= limit; value += 1) {
    if (isPrime(value)) primes += 1;
    if (value % notifyEvery === 0) {
      self.postMessage({
        done: false,
        primes,
        progress: Math.round((value / limit) * 100)
      });
    }
  }

  self.postMessage({ done: true, primes, progress: 100 });
});
`)}`;

interface WorkerResult {
  done: boolean;
  primes: number;
  progress: number;
}

const Demo = () => {
  const [limit, setLimit] = useState(500_000);
  const [started, setStarted] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const [workerVersion, setWorkerVersion] = useState(0);
  const { data, error, post, terminate } = useWebWorker<WorkerResult>(WORKER_URL, {
    name: `prime-worker-${workerVersion}`
  });

  const onRun = () => {
    setStarted(true);
    post(Math.max(2, Math.floor(limit)));
  };

  const onTerminate = () => {
    terminate();
    setTerminated(true);
  };

  const onRestart = () => {
    setStarted(false);
    setTerminated(false);
    setWorkerVersion((version) => version + 1);
  };

  let status = 'Ready';
  if (terminated) status = 'Terminated';
  else if (data?.done && started) status = 'Complete';
  else if (started) status = 'Working';

  const progress = started ? (data?.progress ?? 0) : 0;
  const primes = started ? (data?.primes ?? 0) : 0;

  return (
    <section className='flex w-full max-w-lg flex-col gap-4 rounded-xl border p-4'>
      <div>
        <h3 className='text-sm font-semibold'>Prime number worker</h3>
        <p className='text-muted-foreground text-xs'>
          The calculation runs off the main thread and streams progress back to React.
        </p>
      </div>

      <label className='flex flex-col gap-1 text-xs font-medium'>
        Search limit
        <input
          className='bg-background rounded-md border px-3 py-2 text-sm'
          disabled={terminated}
          max={2_000_000}
          min={2}
          type='number'
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value))}
        />
      </label>

      <div className='flex items-center gap-2'>
        <button
          className='bg-primary text-primary-foreground rounded-md px-3 py-2 text-xs font-medium disabled:opacity-50'
          disabled={terminated}
          type='button'
          onClick={onRun}
        >
          Find primes
        </button>
        <button
          className='rounded-md border px-3 py-2 text-xs font-medium'
          type='button'
          onClick={terminated ? onRestart : onTerminate}
        >
          {terminated ? 'Restart worker' : 'Terminate worker'}
        </button>
        <span className='text-muted-foreground ml-auto text-xs'>{status}</span>
      </div>

      <div className='flex flex-col gap-1'>
        <div className='bg-muted h-2 overflow-hidden rounded-full'>
          <div className='bg-primary h-full transition-[width]' style={{ width: `${progress}%` }} />
        </div>
        <div className='text-muted-foreground flex justify-between text-xs'>
          <span>{progress}%</span>
          <span>{primes.toLocaleString()} primes</span>
        </div>
      </div>

      {!!error && <p className='text-destructive text-xs'>Worker error: {error.type}</p>}
    </section>
  );
};

export default Demo;
