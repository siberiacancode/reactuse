import { useFileSystemAccess } from '@siberiacancode/reactuse';

const Demo = () => {
  const fileSystemAccess = useFileSystemAccess({
    dataType: 'Text',
    types: [
      {
        description: 'Text',
        accept: { 'text/plain': ['.txt'] }
      }
    ]
  });

  if (!fileSystemAccess.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <div className='flex max-w-lg flex-col gap-3'>
      <textarea
        className='box-border min-h-[12rem] w-full resize-y rounded-lg border border-zinc-200 bg-[var(--vp-c-bg-soft)] p-2 font-mono text-sm text-zinc-900 dark:border-zinc-600 dark:text-zinc-100'
        placeholder='Enter your text here'
        rows={4}
        value={fileSystemAccess.data ?? ''}
        onChange={(event) => fileSystemAccess.set(event.target.value)}
      />

      <div className='flex flex-wrap gap-2'>
        <button type='button' onClick={() => void fileSystemAccess.open()}>
          Open
        </button>
        <button type='button' onClick={() => void fileSystemAccess.save()}>
          Save
        </button>
        <button type='button' onClick={() => void fileSystemAccess.update()}>
          Reload
        </button>
      </div>

      {fileSystemAccess.file && (
        <div className='flex flex-col gap-2'>
          <div>
            name: <code>{fileSystemAccess.name}</code>
          </div>
          <div>
            type: <code>{fileSystemAccess.type}</code>
          </div>
          <div>
            size: <code>{fileSystemAccess.size}</code>
          </div>
          <div>
            lastModified: <code>{fileSystemAccess.lastModified}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;
