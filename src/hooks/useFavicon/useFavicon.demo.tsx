import React from 'react';

import { useFavicon } from './useFavicon';

export const REACT_FAVICON_URL = 'https://react.dev/favicon-32x32.png';
export const GOOGLE_FAVICON_URL = 'https://www.google.com/favicon.ico';

const Demo = () => {
  const [url, setUrl] = React.useState(REACT_FAVICON_URL);
  const favicon = useFavicon(url);

  return (
    <>
      <p>
        Current favicon: <code>{favicon.href ?? 'default'}</code>
      </p>

      <div>
        <button type='button' onClick={() => setUrl(GOOGLE_FAVICON_URL)}>
          Change to google favicon
        </button>
        <button type='button' onClick={() => setUrl(REACT_FAVICON_URL)}>
          Change to react favicon
        </button>
      </div>

      <br />

      <div>
        <button type='button' onClick={() => favicon.set(GOOGLE_FAVICON_URL)}>
          Change to google favicon
        </button>
        <button type='button' onClick={() => favicon.set(REACT_FAVICON_URL)}>
          Change to react favicon
        </button>
      </div>
    </>
  );
};

export default Demo;
