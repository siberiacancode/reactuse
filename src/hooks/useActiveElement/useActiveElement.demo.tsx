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
            data-id={String(id)}
            placeholder={String(id)}
            type='text'
            className='rounded border p-2'
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
