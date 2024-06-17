import { useRenderCount } from '../useRenderCount/useRenderCount';

import { useRerender } from './useRerender';

const Demo = () => {
  const rerender = useRerender();
  const renderCount = useRenderCount();

  return (
    <>
      <div key={rerender.id}>
        <p>
          Render count: <code>{renderCount}</code>
        </p>
      </div>
      <button type='button' onClick={rerender.update}>
        Rerender
      </button>
    </>
  );
};

export default Demo;
