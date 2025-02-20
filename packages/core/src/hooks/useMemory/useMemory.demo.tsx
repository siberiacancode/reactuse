import { useMemory } from './useMemory';

const getMB = (bits: number) => (bits / 1024 / 1024).toFixed(2);

const Demo = () => {
  const memory = useMemory();

  return (
    <>
      <p>
        supported: <code>{String(memory.supported)}</code>
      </p>
      <p>
        Used <code>{getMB(memory.value.usedJSHeapSize)} MB</code>
      </p>
      <p>
        Allocated <code>{getMB(memory.value.totalJSHeapSize)} MB</code>
      </p>
      <p>
        Limit <code>{getMB(memory.value.jsHeapSizeLimit)} MB</code>
      </p>
    </>
  );
};

export default Demo;
