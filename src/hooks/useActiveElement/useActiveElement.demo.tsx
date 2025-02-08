import { useActiveElement } from './useActiveElement';

const Demo = () => {
  const activeElement = useActiveElement();
  const activeElementId = activeElement?.dataset?.id ?? 'null';

  return (
    <>
      <div className='grid grid-cols-2 gap-1'>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((id) => (
          <input
            key={id}
            className='rounded border p-2'
            data-id={String(id)}
            type='text'
            placeholder={String(id)}
          />
        ))}
      </div>

      <p>
        current active element: <code>{activeElementId}</code>
      </p>
    </>
  );
};

export default Demo;
