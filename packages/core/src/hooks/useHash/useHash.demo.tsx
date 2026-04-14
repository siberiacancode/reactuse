import { useHash, useMount } from '@siberiacancode/reactuse';

const Demo = () => {
  const hash = useHash();

  useMount(() => hash.set('path/to/page?userId=123'));

  return (
    <div>
      <p>window.location.href:</p>

      <pre className='whitespace-pre-wrap'>{window.location.href}</pre>

      <p>
        <input
          className='w-full'
          value={hash.value}
          onChange={(event) => hash.set(event.target.value)}
        />
      </p>
    </div>
  );
};

export default Demo;
