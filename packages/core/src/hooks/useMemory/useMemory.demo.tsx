import { useMemory } from '@siberiacancode/reactuse';

const formatBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
};

const Demo = () => {
  const memory = useMemory();

  if (!memory.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  if (!memory.value) return null;

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <h3 className='text-sm font-medium text-blue-700'>Used Memory</h3>
          <p className='mt-1 text-2xl font-semibold text-blue-900'>
            {formatBytes(memory.value.usedJSHeapSize)}
          </p>
        </div>

        <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
          <h3 className='text-sm font-medium text-green-700'>Total Memory</h3>
          <p className='mt-1 text-2xl font-semibold text-green-900'>
            {formatBytes(memory.value.totalJSHeapSize)}
          </p>
        </div>

        <div className='rounded-lg border border-purple-200 bg-purple-50 p-4'>
          <h3 className='text-sm font-medium text-purple-700'>Memory Limit</h3>
          <p className='mt-1 text-2xl font-semibold text-purple-900'>
            {formatBytes(memory.value.jsHeapSizeLimit)}
          </p>
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <div className='relative pt-1'>
          <div className='mb-2 flex items-center justify-between'>
            <div>
              <span className='inline-block text-xs font-semibold text-gray-600'>Memory Usage</span>
            </div>
            <div className='text-right'>
              <span className='inline-block text-xs font-semibold text-gray-600'>
                {((memory.value.usedJSHeapSize / memory.value.jsHeapSizeLimit) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className='mb-4 flex h-2 overflow-hidden rounded bg-gray-200 text-xs'>
            <div
              style={{
                width: `${(memory.value.usedJSHeapSize / memory.value.jsHeapSizeLimit) * 100}%`
              }}
              className='flex flex-col justify-center whitespace-nowrap bg-blue-500 text-center text-white shadow-none transition-all duration-500'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
