import { useQueue } from '@siberiacancode/reactuse';

const Demo = () => {
  const { queue, add, remove, first, last, size } = useQueue<number>();

  return (
    <div>
      <ul>
        <li>
          first: <code>{String(first)}</code>
        </li>
        <li>
          last: <code>{String(last)}</code>
        </li>
        <li>
          size: <code>{String(size)}</code>
        </li>
      </ul>

      <div>
        Queue: <code>{JSON.stringify(queue)}</code>
      </div>

      <button type='button' onClick={() => add(last === undefined ? 0 : last + 1)}>
        Add
      </button>
      <button type='button' onClick={remove}>
        Remove
      </button>
    </div>
  );
};

export default Demo;
