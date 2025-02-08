import { useCssVar } from './useCssVar';

const Demo = () => {
  const key = '--color';
  const colorVar = useCssVar(key, '#7fa998');
  const style = {
    color: 'var(--color)'
  };

  const switchColor = () => {
    if (colorVar.value === '#df8543') colorVar.set('#7fa998');
    else colorVar.set('#df8543');
  };

  return (
    <>
      <p style={style}>Sample text, {colorVar.value}</p>
      <button type='button' onClick={switchColor}>
        Change Color
      </button>
    </>
  );
};

export default Demo;
