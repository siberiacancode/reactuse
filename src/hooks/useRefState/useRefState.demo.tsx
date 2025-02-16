import { useRefState } from './useRefState';

const Demo = () => {
  const internalRefState = useRefState<number>(0);

  return (
    <div>
      <p>Render count: <code>{internalRefState.current}</code></p>
      <button type='button' onClick={() => {
        internalRefState.current += 1;
      }}>
        Ref Update
      </button>
    </div>
  );
};

export default Demo;
