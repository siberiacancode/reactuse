import React from 'react';

import { useSet } from './useSet';

const Demo = () => {
  const [input, setInput] = React.useState('');
  const scopes = useSet(['@siberiacancode', '@siberiacancode-tests', '@shared']);

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
        {Array.from(scopes).map((scope) => (
          <>
            <code key={scope}>{scope}</code>{' '}
          </>
        ))}
      </div>
    </>
  );
};

export default Demo;
