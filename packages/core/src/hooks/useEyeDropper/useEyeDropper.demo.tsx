import { useCopy, useEyeDropper } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon, PipetteIcon } from 'lucide-react';

const Demo = () => {
  const eyeDropper = useEyeDropper();
  const { copy, copied } = useCopy();

  if (!eyeDropper.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const color = eyeDropper.value;

  return (
    <section className='demo-ui flex flex-col items-center gap-3 p-4'>
      <div className='border-border bg-card flex aspect-square w-[280px] items-center justify-center overflow-hidden rounded-2xl border shadow-sm'>
        <img
          alt='Pick a color from this image'
          className='size-full object-contain p-4'
          draggable={false}
          src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'
        />
      </div>

      <div className='border-border bg-card flex w-[280px] items-center gap-3 rounded-xl border p-2.5 shadow-sm'>
        <div
          className='border-border size-10 shrink-0 rounded-lg border'
          style={{ backgroundColor: color ?? 'transparent' }}
        />

        <div className='flex min-w-0 flex-1 flex-col leading-tight'>
          <span className='text-muted-foreground text-[9px] tracking-[0.15em] uppercase'>
            Selected color
          </span>
          <span className='text-foreground font-mono text-sm font-semibold uppercase tabular-nums'>
            {color ?? '—'}
          </span>
        </div>

        {color && (
          <button
            aria-label='Copy hex'
            data-size='icon'
            data-variant='ghost'
            type='button'
            onClick={() => copy(color)}
          >
            {copied && <CheckIcon className='size-3.5 text-green-500' />}
            {!copied && <CopyIcon className='size-3.5' />}
          </button>
        )}

        <button
          aria-label='Pick color'
          data-size='icon'
          type='button'
          onClick={() => eyeDropper.open()}
        >
          <PipetteIcon className='size-3.5' />
        </button>
      </div>
    </section>
  );
};

export default Demo;
