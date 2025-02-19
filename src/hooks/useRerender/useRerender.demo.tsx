import { useRenderCount } from '../useRenderCount/useRenderCount';
import { useRerender } from './useRerender';

const Demo = () => {
  const rerender = useRerender();
  const renderCount = useRenderCount();

  return (
    <>
      <p>
        Render count: <code>{renderCount}</code>
      </p>

      <button type='button' onClick={rerender}>
        Rerender
      </button>
    </>
  );
};

export default Demo;
