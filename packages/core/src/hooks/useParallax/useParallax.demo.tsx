import { useParallax } from '@siberiacancode/reactuse';

const Demo = () => {
  const parallax = useParallax<HTMLDivElement>();

  const getLayerStyle = (multiplier: number) => ({
    transform: `translateX(${parallax.value.tilt * multiplier * 10}px) translateY(${parallax.value.roll * multiplier * 10}px)`
  });

  return (
    <div
      ref={parallax.ref}
      className='flex min-h-[500px] flex-col justify-center transition-all duration-300 ease-out'
    >
      <pre className='lang-json'>
        <b>Parallax data:</b>
        <p>{JSON.stringify(parallax.value, null, 2)}</p>
      </pre>
      <div className='perspective-[300px] mx-auto my-12'>
        <div
          style={{
            transform: `rotateX(${parallax.value.roll * 20}deg) rotateY(${parallax.value.tilt * 20}deg)`
          }}
          className='flex h-72 w-56 items-center justify-center overflow-hidden rounded border border-[#cdcdcd] bg-white shadow-[0_0_20px_0_rgba(255,255,255,0.25)] transition-all duration-300 ease-out'
        >
          <div className='relative size-[4em] overflow-hidden text-6xl'>
            <img
              alt='layer0'
              className='absolute h-full w-full transition-all duration-300 ease-out'
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_3.png'
              style={getLayerStyle(1)}
            />
            <img
              alt='layer1'
              className='absolute h-full w-full transition-all duration-300 ease-out'
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_2.png'
              style={getLayerStyle(2)}
            />
            <img
              alt='layer2'
              className='absolute h-full w-full transition-all duration-300 ease-out'
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_1.png'
              style={getLayerStyle(3)}
            />
            <img
              alt='layer3'
              className='absolute h-full w-full transition-all duration-300 ease-out'
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_0.png'
              style={getLayerStyle(4)}
            />
          </div>
        </div>
      </div>
      <div>
        Credit of images to{' '}
        <a
          href='https://codepen.io/jaromvogel'
          className='text-blue-500 hover:underline'
          target='__blank'
        >
          Jarom Vogel
        </a>
      </div>
    </div>
  );
};

export default Demo;
