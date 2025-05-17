import { useCssVar } from '@siberiacancode/reactuse';

const Demo = () => {
  const colorVar = useCssVar('--color', '#7fa998');

  const switchColor = () => {
    if (colorVar.value === '#df8543') colorVar.set('#7fa998');
    else colorVar.set('#df8543');
  };

  return (
    <>
      <p style={{ color: 'var(--color)' }}>Sample text, {colorVar.value}</p>
      <button type='button' onClick={switchColor}>
        Change Color
      </button>
    </>
  );
};

export default Demo;
