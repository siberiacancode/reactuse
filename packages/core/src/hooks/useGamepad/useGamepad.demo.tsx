import { useGamepad } from '@siberiacancode/reactuse';

const Demo = () => {
  const { supported, gamepads } = useGamepad();

  return (
    <>
      <p>
        supported: <code>{String(supported)}</code>
      </p>

      <p>Gamepads</p>
      {!gamepads.length && <code>no gamepads connected</code>}
      {!!gamepads.length && (
        <>
          {gamepads.map((gamepad) => (
            <div key={gamepad.id}>
              <p>
                id: <code>{gamepad.id}</code>
              </p>
              <p>
                index: <code>{gamepad.index}</code>
              </p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Demo;
