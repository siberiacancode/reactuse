import { useRenderInfo, useRerender } from '@siberiacancode/reactuse';

const Demo = () => {
  const rerender = useRerender();
  const renderInfo = useRenderInfo('Component');

  return (
    <>
      <p>
        Name: <code>{renderInfo.component}</code>
      </p>
      <p>
        Count renders: <code>{renderInfo.renders}</code>
      </p>
      <p>
        Since last render: <code>{renderInfo.sinceLast} ms</code>
      </p>
      <p>
        Timestamp: <code>{renderInfo.timestamp}</code>
      </p>
      <button type='button' onClick={rerender}>
        Rerender
      </button>
    </>
  );
};

export default Demo;
