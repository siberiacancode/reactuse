import { useUrlSearchParams } from './useUrlSearchParams';

const Demo = () => {
  const urlSearchParams = useUrlSearchParams('history', {
    initialValue: { param1: 'value1', param2: 'value2' },
    writeMode: 'push'
  });

  const onUrlSearchParamAdd = () => {
    const paramCount = Object.keys(urlSearchParams.value).length + 1;
    urlSearchParams.set({ [`param${paramCount}`]: `value${paramCount}` });
  };

  return (
    <div className='flex flex-col gap-3'>
      {Object.entries(urlSearchParams.value).map(([key, value]) => (
        <div key={key} className='flex items-center gap-3'>
          <p>{key}:</p>
          <input
            className='w-fit'
            value={value}
            onChange={(event) => urlSearchParams.set({ [key]: event.target.value })}
            placeholder='Type value for url param'
          />
        </div>
      ))}
      <button className='w-30' type='button' onClick={onUrlSearchParamAdd}>
        Add
      </button>
    </div>
  );
};

export default Demo;
