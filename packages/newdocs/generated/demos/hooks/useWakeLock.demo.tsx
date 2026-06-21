'use client'

import { useWakeLock } from '@siberiacancode/reactuse';
import { MoonIcon } from 'lucide-react';

const INGREDIENTS = [
  '300g pizza dough',
  '100g tomato sauce',
  '200g fresh mozzarella',
  'A handful of basil leaves',
  '2 tbsp olive oil',
  'Salt to taste'
];

const STEPS = [
  'Preheat your oven to 250°C (480°F) with a baking stone or tray inside.',
  'Roll out the dough on a floured surface into a thin, round base.',
  'Spread the tomato sauce evenly, leaving a small border for the crust.',
  'Tear the mozzarella over the top and drizzle with olive oil.',
  'Bake for 10–12 minutes, until the crust is golden and the cheese bubbles.',
  'Finish with fresh basil, a pinch of salt, and serve immediately.'
];

const Demo = () => {
  const wakeLock = useWakeLock({
    immediately: true
  });

  if (!wakeLock.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/WakeLock'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <article className='mx-auto flex w-full max-w-xl flex-col gap-6 p-6'>
      <header className='flex flex-col items-start gap-4'>
        <div className='size-14! shrink-0 text-3xl' data-slot='avatar'>
          <span className='text-3xl!' data-slot='avatar-fallback'>
            🍕
          </span>
        </div>
        <div className='flex flex-col gap-1'>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>Margherita Pizza</h1>
          <p className='text-muted-foreground text-sm'>
            The classic Neapolitan pizza — simple, fresh, and ready in about 25 minutes.
          </p>
        </div>
      </header>

      <section className='flex flex-col gap-3'>
        <h2 className='text-foreground text-lg font-semibold'>Ingredients</h2>
        <ul className='text-muted-foreground marker:text-muted-foreground/50 flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed'>
          {INGREDIENTS.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section className='flex flex-col gap-3'>
        <h2 className='text-foreground text-lg font-semibold'>Method</h2>
        <ol className='text-muted-foreground marker:text-muted-foreground/50 flex list-decimal flex-col gap-3 pl-5 text-base leading-relaxed marker:font-medium'>
          {STEPS.map((step) => (
            <li key={step} className='pl-1'>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <p className='text-muted-foreground border-border flex items-center gap-2 border-t pt-4 text-sm'>
        <MoonIcon className='size-4 shrink-0' />
        Your screen will stay awake while you follow this recipe.
      </p>
    </article>
  );
};

export default Demo;
