import { useCopy } from '@siberiacancode/reactuse';

const Demo = () => {
  const { copy, copied } = useCopy();

  return (
    <>
      <div>
        <pre className='shiki shiki-themes github-light github-dark vp-code'>
          <code>
            <span className='line'>
              <span
                style={
                  {
                    '--shiki-light': '#6F42C1',
                    '--shiki-dark': '#B392F0'
                  } as React.CSSProperties
                }
              >
                npm
              </span>
              <span
                style={
                  {
                    '--shiki-light': '#032F62',
                    '--shiki-dark': '#9ECBFF'
                  } as React.CSSProperties
                }
              >
                {' '}
                install
              </span>
              <span
                style={
                  {
                    '--shiki-light': '#032F62',
                    '--shiki-dark': '#9ECBFF'
                  } as React.CSSProperties
                }
              >
                {' '}
                @siberiacancode/reactuse
              </span>
            </span>
          </code>
        </pre>
      </div>
      <p>Click the button to copy the installation command to your clipboard.</p>
      <button
        disabled={copied}
        type='button'
        onClick={() => copy('npm install @siberiacancode/reactuse')}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </>
  );
};

export default Demo;
