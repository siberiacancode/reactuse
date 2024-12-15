import { useToggle } from '../useToggle/useToggle';

import { useImage } from './useImage';

const Demo = () => {
  const [color, toggle] = useToggle(['ffffff', '000000', '5f0caa']);
  const image = useImage(`https://place-hold.it/300x200/${color}`);

  return (
    <p>
      {image.isLoading && <div style={{ width: 300, height: 200 }}>Loading...</div>}
      {!image.isLoading && image.data && (
        <img
          alt='demo'
          style={{ width: 300, height: 200 }}
          src={`https://place-hold.it/300x200/${color}`}
        />
      )}
      <button type='button' onClick={() => toggle()}>
        Change
      </button>
    </p>
  );
};

export default Demo;
