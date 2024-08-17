import { Fragment, useState } from 'react';

import { useSet } from './useSet';

const Demo = () => {
  const [input, setInput] = useState('');
  const scopes = useSet([
    '@siberiacancode',
    '@siberiacancode-tests',
    '@shared'
  ]);

  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder='Enter scope'
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
        />

        <button
          type='button'
          onClick={() => {
            scopes.add(input.trim().toLowerCase());
            setInput('');
          }}
        >
          Add
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        {Array.from(scopes.value).map((scope, index) => (
          <Fragment key={index}>
            <code key={index}>{scope}</code>{' '}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default Demo;
