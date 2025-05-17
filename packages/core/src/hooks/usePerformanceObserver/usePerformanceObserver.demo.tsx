import { usePerformanceObserver } from '@siberiacancode/reactuse';

const Demo = () => {
  const performance = usePerformanceObserver({
    entryTypes: ['paint'],
    immediate: true
  });

  const refresh = () => window.location.reload();

  if (!performance.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <div>
      <p>Performance entries:</p>
      <ul>
        {performance.entries.map((entry, index) => (
          <li key={index}>
            {entry.name}:{' '}
            <code>
              {entry.startTime} - {entry.duration}ms
            </code>
          </li>
        ))}
      </ul>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
};

export default Demo;
