import { useMount } from '../useMount/useMount';

import { useHash } from './useHash';

const Demo = () => {
  const [hash, setHash] = useHash();

  useMount(() => setHash('path/to/page?userId=123'));

  return (
    <div>
      <p>window.location.href:</p>
      <p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{window.location.href}</pre>
      </p>
      <p>Edit hash: </p>
      <p>
        <input
          style={{ width: '100%' }}
          value={hash}
          onChange={(event) => setHash(event.target.value)}
        />
      </p>
    </div>
  );
};

export default Demo;
