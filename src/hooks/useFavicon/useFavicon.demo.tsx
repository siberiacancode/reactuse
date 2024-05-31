import { useFavicon } from './useFavicon';

const REACT_FAVICON_URL = 'https://react.dev/favicon-32x32.png';
const GOOGLE_FAVICON_URL = 'https://www.google.com/favicon.ico';
const getSvgEmoji = (emoji: string) =>
  `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`.trim();

const Demo = () => {
  const favicon = useFavicon(REACT_FAVICON_URL);

  return (
    <>
      <p>
        Current favicon: <code>{favicon.href ?? 'default'}</code>
      </p>

      <div>
        <button type='button' onClick={() => favicon.set(GOOGLE_FAVICON_URL)}>
          Change to google favicon
        </button>
        <button type='button' onClick={() => favicon.set(REACT_FAVICON_URL)}>
          Change to react favicon
        </button>
        <button
          type='button'
          onClick={() => favicon.set(`data:image/svg+xml,${getSvgEmoji('🔥')}`)}
        >
          Change to emoji 🔥
        </button>
      </div>
    </>
  );
};

export default Demo;
