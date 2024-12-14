import { useRerender } from '../useRerender/useRerender';
import { useRenderInfo } from './useRenderInfo';

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
      <button type='button' onClick={rerender.update}>
        Rerender
      </button>
    </>
  );
};

export default Demo;
