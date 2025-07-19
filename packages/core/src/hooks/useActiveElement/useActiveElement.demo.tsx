import { useActiveElement } from '@siberiacancode/reactuse';

const Demo = () => {
  const activeElement = useActiveElement<HTMLDivElement>();
  const activeElementId = activeElement?.value?.dataset?.id ?? 'null';

  return (
    <>
      <div ref={activeElement.ref} className='mt-1 grid grid-cols-2 gap-1'>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((id) => (
          <input
            key={id}
            className='w-min-content rounded border p-2'
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
