import { useParallax } from './useParallax';

const Demo = () => {
  const parallax = useParallax<HTMLDivElement>();

  const getLayerStyle = (multiplier: number) => ({
    transform: `translateX(${parallax.value.tilt * multiplier * 10}px) translateY(${parallax.value.roll * multiplier * 10}px)`
  });

  return (
    <div ref={parallax.ref} className="flex flex-col justify-center min-h-[500px] transition-all duration-300 ease-out">
      <pre className="lang-json">
        <b>Parallax data:</b>
        <p>{JSON.stringify(parallax.value, null, 2)}</p>
      </pre>
      <div className="mx-auto my-12 perspective-[300px]">
        <div
          className="bg-white h-72 w-56 flex justify-center items-center rounded border border-[#cdcdcd] overflow-hidden transition-all duration-300 ease-out shadow-[0_0_20px_0_rgba(255,255,255,0.25)]"
          style={{
            transform: `rotateX(${parallax.value.roll * 20}deg) rotateY(${parallax.value.tilt * 20}deg)`
          }}
        >
          <div className="overflow-hidden text-6xl size-[4em] relative">
            <img
              alt="layer0"
              src="https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_3.png"
              className="absolute h-full w-full transition-all duration-300 ease-out"
              style={getLayerStyle(1)}
            />
            <img
              alt="layer1"
              src="https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_2.png"
              className="absolute h-full w-full transition-all duration-300 ease-out"
              style={getLayerStyle(2)}
            />
            <img
              alt="layer2"
              src="https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_1.png"
              className="absolute h-full w-full transition-all duration-300 ease-out"
              style={getLayerStyle(3)}
            />
            <img
              alt="layer3"
              src="https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_0.png"
              className="absolute h-full w-full transition-all duration-300 ease-out"
              style={getLayerStyle(4)}
            />
          </div>
        </div>
      </div>
      <div>
        Credit of images to{' '}
        <a href="https://codepen.io/jaromvogel" target="__blank" className="text-blue-500 hover:underline">
          Jarom Vogel
        </a>
      </div>
    </div>
  );
};

export default Demo;
