'use client';

import { useGamepad } from '@siberiacancode/reactuse';

const Demo = () => {
  const { supported, gamepads } = useGamepad();

  if (!supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getGamepads'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <>
      <p>Gamepads</p>
      {!gamepads.length && <b>no gamepads connected</b>}
      {!!gamepads.length && (
        <>
          {gamepads.map((gamepad) => (
            <div key={gamepad.id}>
              <p>
                id: <b>{gamepad.id}</b>
              </p>
              <p>
                index: <b>{gamepad.index}</b>
              </p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Demo;
