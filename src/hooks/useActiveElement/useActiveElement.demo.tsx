import { useActiveElement } from './useActiveElement';

const Demo = () => {
  const activeElement = useActiveElement();
  const activeElementId = activeElement?.dataset?.id ?? 'null';

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((id) => (
          <input key={id} data-id={String(id)} type='text' placeholder={String(id)} />
        ))}
      </div>

      <p>
        current active element: <code>{activeElementId}</code>
      </p>
    </>
  );
};

export default Demo;
