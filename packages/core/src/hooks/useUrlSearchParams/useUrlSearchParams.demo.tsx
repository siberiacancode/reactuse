import { getUrlSearchParams, useUrlSearchParams } from './useUrlSearchParams';

interface DemoUrlParams {
  enabled: boolean;
  text: string;
}

const Demo = () => {
  const urlSearchParams = useUrlSearchParams<DemoUrlParams>({
    text: 'hello',
    enabled: false
  });

  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-2'>
        <p>Text input:</p>
        <input
          className='w-fit'
          value={urlSearchParams.value.text}
          onChange={(event) => urlSearchParams.set({ text: event.target.value })}
          placeholder='Text param'
        />
      </div>

      <div className='flex items-center gap-2'>
        <input
          checked={urlSearchParams.value.enabled}
          type='checkbox'
          onChange={(event) => urlSearchParams.set({ enabled: event.target.checked })}
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
