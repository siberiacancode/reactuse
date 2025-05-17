import { useImage, useToggle } from '@siberiacancode/reactuse';

const Demo = () => {
  const [color, toggle] = useToggle(['ffffff', '000000', '5f0caa']);
  const image = useImage(`https://place-hold.it/300x200/${color}`);

  return (
    <p>
      {image.isLoading && <div className='h-xs w-xs'>Loading...</div>}
      {!image.isLoading && image.data && (
        <img alt='demo' className='h-xs w-xs' src={`https://place-hold.it/300x200/${color}`} />
      )}
      <button type='button' onClick={() => toggle()}>
        Change
      </button>
    </p>
  );
};

export default Demo;
