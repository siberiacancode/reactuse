import { useObjectUrl } from '@siberiacancode/reactuse';

const Demo = () => {
  const objectUrl = useObjectUrl();

  return (
    <>
      <p>
        URL: <code>{objectUrl.value ?? 'none'}</code>
      </p>
      <button
        type='button'
        onClick={() => {
          if (objectUrl.value) return objectUrl.revoke();
          objectUrl.set(new Blob(['reactuse'], { type: 'text/plain' }));
        }}
      >
        {objectUrl.value ? 'Clear blob' : 'Create blob URL'}
      </button>
    </>
  );
};

export default Demo;
