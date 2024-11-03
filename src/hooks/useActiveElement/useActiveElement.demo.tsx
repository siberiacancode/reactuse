import { useActiveElement } from './useActiveElement';

const Demo = () => {
  const activeElement = useActiveElement();
  const activeElementId = activeElement?.dataset?.id ?? 'null';

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((id) => (
          <input key={id} type='text' data-id={String(id)} placeholder={String(id)} />
        ))}
      </div>

      <p>
        current active element: <code>{activeElementId}</code>
      </p>
    </>
  );
};

export default Demo;
