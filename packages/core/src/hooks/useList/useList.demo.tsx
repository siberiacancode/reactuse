import { useList } from '@siberiacancode/reactuse';

const Demo = () => {
  const list = useList([1, 2, 3, 4, 5]);

  return (
    <div>
      <button type='button' onClick={() => list.set([1, 2, 3])}>
        Set to [1, 2, 3]
      </button>
      <button type='button' onClick={() => list.push(Date.now())}>
        Push timestamp
      </button>
      <button type='button' onClick={() => list.updateAt(1, Date.now())}>
        Update value at index 1
      </button>
      <button type='button' onClick={() => list.removeAt(1)}>
        Remove element at index 1
      </button>
      <button type='button' onClick={list.clear}>
        Clear
      </button>
      <button type='button' onClick={list.reset}>
        Reset
      </button>
      <pre>{JSON.stringify(list, null, 2)}</pre>
    </div>
  );
};

export default Demo;
