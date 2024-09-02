import type { CSSProperties } from 'react';

import { useParallax } from './useParallax';

const Demo = () => {
  const parallax = useParallax<HTMLDivElement>();

  const layerBase: CSSProperties = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    transition: '.3s ease-out all'
  };

  const layer0 = {
    ...layerBase,
    transform: `translateX(${parallax.value.tilt * 10}px) translateY(${
      parallax.value.roll * 10
    }px)`
  };

  const layer1 = {
    ...layerBase,
    transform: `translateX(${parallax.value.tilt * 20}px) translateY(${
      parallax.value.roll * 20
    }px)`
  };

  const layer2 = {
    ...layerBase,
    transform: `translateX(${parallax.value.tilt * 30}px) translateY(${
      parallax.value.roll * 30
    }px)`
  };

  const layer3 = {
    ...layerBase,
    transform: `translateX(${parallax.value.tilt * 40}px) translateY(${
      parallax.value.roll * 40
    }px)`
  };

  const cardStyle = {
    background: '#fff',
    height: '18rem',
    width: '14rem',
    borderRadius: '5px',
    border: '1px solid #cdcdcd',
    overflow: 'hidden',
    transition: '.3s ease-out all',
    boxShadow: '0 0 20px 0 rgba(255, 255, 255, 0.25)',
    transform: `rotateX(${parallax.value.roll * 20}deg) rotateY(${
      parallax.value.tilt * 20
    }deg)`
  };

  const containerStyle: CSSProperties = {
    margin: '3em auto',
    perspective: '200px'
  };

  const cardContentStyle: CSSProperties = {
    overflow: 'hidden',
    fontSize: '6rem',
    position: 'absolute',
    top: 'calc(50% - 1em)',
    left: 'calc(50% - 1em)',
    height: '2em',
    width: '2em',
    margin: 'auto'
  };

  const targetStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '500px',
    transition: '.3s ease-out all'
  };

  return (
    <div ref={parallax.ref} style={targetStyle}>
      <pre lang='json'>
        <b>Parallax data:</b>
        <p>{JSON.stringify(parallax.value, null, 2)}</p>
      </pre>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={cardContentStyle}>
            <img
              style={layer0}
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_3.png'
              alt='layer0'
            />
            <img
              style={layer1}
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_2.png'
              alt='layer1'
            />
            <img
              style={layer2}
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_1.png'
              alt='layer2'
            />
            <img
              style={layer3}
              src='https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_0.png'
              alt='layer3'
            />
          </div>
        </div>
      </div>
      <div>
        Credit of images to{' '}
        <a
          href='https://codepen.io/jaromvogel'
          target='__blank'
        >Jarom Vogel
        </a>
      </div>
    </div>
  );
};

export default Demo;
