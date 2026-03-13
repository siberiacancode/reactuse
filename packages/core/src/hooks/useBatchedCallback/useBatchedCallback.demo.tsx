import { useBatchedCallback, useCounter } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [batches, setBatches] = useState<number[][]>([]);
  const [currentBatch, setCurrentBatch] = useState<number[]>([]);
  const counter = useCounter(0);

  const batchedNumbers = useBatchedCallback((batch: [number][]) => {
    const numbers = batch.map(([num]) => num);
    setBatches((currentBatches) => [...currentBatches, numbers]);
    counter.inc(numbers.reduce((acc, number) => acc + number, 0));
    setCurrentBatch([]);
  }, 5);

  const onAdd = () => {
    const random = Math.floor(Math.random() * 100);
    setCurrentBatch((currentBatch) => (currentBatch.length >= 5 ? [] : [...currentBatch, random]));
    batchedNumbers(random);
  };

  return (
    <>
      <div className='mb-4 flex flex-col gap-2'>
        <label>Batched random numbers (flush every 5 adds)</label>
      </div>

      <div className='text-muted-foreground text-xs'>
        Last batch: {batches.at(-1)?.join(', ') ?? '—'}
      </div>
      <div className='text-muted-foreground text-xs'>
        Current batch: {currentBatch.length ? currentBatch.join(', ') : '—'}
      </div>

      <button className='mt-4 rounded px-3 py-2 text-white' type='button' onClick={onAdd}>
        Add random
      </button>
      <div className='flex gap-4 text-sm'>
        <div>Total sum: {counter.value}</div>
        <div>Total batches: {batches.length}</div>
      </div>
    </>
  );
};

export default Demo;
