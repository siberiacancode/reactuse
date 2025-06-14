import { getUrlSearchParams, useUrlSearchParam } from './useUrlSearchParam';

const Demo = () => {
  const textSearchParam = useUrlSearchParam('text', 'hello');
  const enabledSearchParam = useUrlSearchParam('enabled', false);

  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-2'>
        <p>Text input:</p>
        <input
          className='w-fit'
          value={textSearchParam.value}
          onChange={(event) => textSearchParam.set(event.target.value)}
          placeholder='Text param'
        />
      </div>

      <div className='flex items-center gap-2'>
        <input
          checked={enabledSearchParam.value}
          type='checkbox'
          onChange={(event) => enabledSearchParam.set(event.target.checked)}
        />
        <label htmlFor='enabled'>enabled toggle</label>
      </div>

      <div className='mt-4 flex flex-col gap-2'>
        <strong>Url params: </strong>
        <pre lang='json'>
          {JSON.stringify(Object.fromEntries(new URLSearchParams(getUrlSearchParams())), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Demo;
