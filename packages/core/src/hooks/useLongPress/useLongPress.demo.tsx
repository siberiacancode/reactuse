import { useCounter, useLongPress } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();
  const longPress = useLongPress<HTMLButtonElement>(() => counter.inc());

  return (
    <>
      <p>
        Long pressed: <code>{longPress.pressed.toString()}</code>
      </p>
      <p>
        Clicked: <code>{counter.value}</code>
      </p>
      <button ref={longPress.ref} type='button'>
        Long press
      </button>
    </>
  );
};

export default Demo;
