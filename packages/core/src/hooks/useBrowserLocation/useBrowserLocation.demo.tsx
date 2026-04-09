import { useBrowserLocation } from '@siberiacancode/reactuse';

const Demo = () => {
  const location = useBrowserLocation();

  return (
    <div>
      <p>Browser location state</p>

      <ul>
        <li>
          href: <code>{location.value.href || 'none'}</code>
        </li>
        <li>
          pathname: <code>{location.value.pathname || 'none'}</code>
        </li>
        <li>
          search: <code>{location.value.search || 'none'}</code>
        </li>
        <li>
          hash: <code>{location.value.hash || 'none'}</code>
        </li>
        <li>
          state: <code>{JSON.stringify(location.value.state || 'none')}</code>
        </li>
        <li>
          history.length: <code>{location.value.length || 'none'}</code>
        </li>
      </ul>

      <div className='flex flex-wrap gap-2'>
        <button
          onClick={() =>
            location.push('/functions/hooks/useBrowserLocation/?tab=push#demo', { from: 'push' })
          }
        >
          push
        </button>

        <button
          onClick={() =>
            location.replace('/functions/hooks/useBrowserLocation/?tab=replace#demo', {
              from: 'replace'
            })
          }
        >
          replace
        </button>

        <button
          onClick={() =>
            location.push(
              '/functions/hooks/useBrowserLocation/?tab=history#demo',
              { from: 'history-style', nested: true },
              'history-title'
            )
          }
        >
          push(url, state, title)
        </button>
      </div>
    </div>
  );
};

export default Demo;
