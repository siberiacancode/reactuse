import { useHash, useMount } from '@siberiacancode/reactuse';

const Demo = () => {
  const [hash, setHash] = useHash();

  useMount(() => setHash('path/to/page?userId=123'));

  return (
    <div>
      <p>window.location.href:</p>
      <p>
        <pre className='whitespace-pre-wrap'>{window.location.href}</pre>
      </p>
      <p>Edit hash: </p>
      <p>
        <input className='w-full' value={hash} onChange={(event) => setHash(event.target.value)} />
      </p>
    </div>
  );
};

export default Demo;
