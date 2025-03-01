import { usePerformanceObserver } from './usePerformanceObserver';

const Demo = () => {
  const performance = usePerformanceObserver(
    { entryTypes: ['paint'], immediate: true }
  );

  const refresh = () => window.location.reload();

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
