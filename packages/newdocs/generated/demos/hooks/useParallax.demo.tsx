'use client'

import { useParallax } from '@siberiacancode/reactuse';

const LAYERS = [
  {
    id: 'parallax-layer-0',
    src: 'https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_3.png',
    multiplier: 1
  },
  {
    id: 'parallax-layer-1',
    src: 'https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_2.png',
    multiplier: 2
  },
  {
    id: 'parallax-layer-2',
    src: 'https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_1.png',
    multiplier: 3
  },
  {
    id: 'parallax-layer-3',
    src: 'https://jaromvogel.com/images/design/tiger_hunt_parallax/Tiger_hunt_0.png',
    multiplier: 4
  }
];

const Demo = () => {
  const parallax = useParallax<HTMLDivElement>((value) => {
    const card = document.getElementById('parallax-card');
    if (card) {
      card.style.transform = `rotateX(${value.roll * 20}deg) rotateY(${value.tilt * 20}deg)`;
    }

    LAYERS.forEach((layer) => {
      const element = document.getElementById(layer.id);
      if (!element) return;
      element.style.transform = `translateX(${value.tilt * layer.multiplier * 10}px) translateY(${value.roll * layer.multiplier * 10}px)`;
    });
  });

  return (
    <section
      ref={parallax.ref}
      className='flex min-h-96 flex-col items-center justify-center gap-6 p-6'
    >
      <p className='text-muted-foreground max-w-xs text-center text-sm'>
        Move your mouse over the scene — or tilt your device — to shift the layers and create depth.
      </p>

      <div className='perspective-[300px]'>
        <div
          className='border-border flex h-72 w-56 items-center justify-center overflow-hidden rounded-xl border bg-white shadow-lg transition-transform duration-300 ease-out'
          id='parallax-card'
        >
          <div className='relative size-[4em] overflow-hidden text-6xl'>
            {LAYERS.map((layer) => (
              <img
                key={layer.id}
                alt={layer.id}
                className='absolute h-full w-full transition-transform duration-300 ease-out'
                id={layer.id}
                src={layer.src}
              />
            ))}
          </div>
        </div>
      </div>

      <p className='text-muted-foreground text-xs'>
        Credit of images to{' '}
        <a
          className='text-primary hover:underline'
          href='https://codepen.io/jaromvogel'
          rel='noreferrer'
          target='_blank'
        >
          Jarom Vogel
        </a>
      </p>
    </section>
  );
};

export default Demo;
