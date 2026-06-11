'use client'

import { useIntersectionObserver } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

const SECTIONS = [
  {
    id: 'ingredients',
    label: 'Ingredients',
    title: 'Ingredients',
    body: 'For the mashed potatoes you will need about 1kg of starchy potatoes (Russet or Yukon Gold work best), 100ml of warm milk, 60g of butter and a generous pinch of salt. For the cutlets prepare 500g of ground beef, 1 small onion finely chopped, 1 egg, 2 slices of white bread soaked in milk, salt and pepper to taste.'
  },
  {
    id: 'preparation',
    label: 'Preparation',
    title: 'Preparation',
    body: 'Peel the potatoes and cut them into equal chunks so they cook evenly. Finely chop the onion for the cutlets — the smaller the pieces, the more tender the meat will be. Soak the bread in milk for about 5 minutes, then gently squeeze out the excess liquid before adding it to the meat mixture.'
  },
  {
    id: 'cooking-potatoes',
    label: 'Mashed potatoes',
    title: 'Cooking the mashed potatoes',
    body: 'Place the potato chunks into cold salted water and bring to a boil. Simmer for 15-20 minutes until easily pierced with a fork. Drain well, return to the warm pot, then mash while gradually adding warm milk and butter. Season with salt and beat with a wooden spoon until silky smooth.'
  },
  {
    id: 'cooking-cutlets',
    label: 'Beef cutlets',
    title: 'Cooking the beef cutlets',
    body: 'Combine the ground beef, chopped onion, soaked bread, egg, salt and pepper in a large bowl. Mix thoroughly with your hands until even — this helps the cutlets hold their shape. Form into oval patties about 2cm thick and pan-fry in a hot skillet with sunflower oil, 4 minutes per side, until golden brown and cooked through.'
  },
  {
    id: 'serving',
    label: 'Serving',
    title: 'Serving',
    body: 'Serve the cutlets hot, placed on a generous mound of mashed potatoes. A spoonful of pickled cucumbers or a fresh dill sprig on top adds a nice contrast in flavor and color. Best enjoyed immediately while everything is still warm and the butter is melting into the mash.'
  },
  {
    id: 'tips',
    label: 'Tips',
    title: 'Tips and tricks',
    body: 'Never add cold milk to mashed potatoes — it will make them gluey and lifeless. For extra tender cutlets, mix the meat for a minute longer than feels necessary. If you have leftovers, the cutlets reheat beautifully the next day, especially in a covered pan with a splash of water.'
  }
];

const Demo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const intersection = useIntersectionObserver(rootRef, {
    root: rootRef,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0,
    onChange: (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveId(visible.target.id.replace('section-', ''));
    }
  });

  const onSectionMount = (element: HTMLElement) => {
    if (element && intersection.observer) intersection.observer.observe(element);
  };

  const onSectionClick = (id: string) => {
    document
      .getElementById(`section-${id}`)!
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0];

  return (
    <section className='flex w-full max-w-2xl flex-col p-4'>
      <div className='relative flex h-[420px] gap-6'>
        <div ref={rootRef} className='no-scrollbar flex-1 overflow-y-auto'>
          <div className='flex flex-col gap-8 sm:pr-2'>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
                Recipe
              </span>
              <h2 className='text-foreground text-xl font-bold'>Mashed potatoes & beef cutlets</h2>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                A classic homestyle dinner that brings comfort to any table — fluffy mashed potatoes
                paired with juicy beef cutlets.
              </p>
            </div>

            {SECTIONS.map((section) => (
              <section
                key={section.id}
                ref={onSectionMount}
                className='scroll-mt-2'
                id={`section-${section.id}`}
              >
                <h3 className='text-foreground mb-2 text-sm font-semibold'>{section.title}</h3>
                <p className='text-muted-foreground text-xs leading-relaxed'>{section.body}</p>
              </section>
            ))}
          </div>
        </div>

        <aside className='hidden w-[160px] shrink-0 sm:block'>
          <div className='sticky top-0'>
            <span className='text-muted-foreground mb-2 block px-2 text-[10px] tracking-[0.15em] uppercase'>
              On this page
            </span>
            <ul className='flex flex-col gap-0.5'>
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    className={cn(
                      'block w-full justify-start! rounded-md px-2 py-1 text-xs transition-colors',
                      activeId === section.id
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    data-variant='unstyled'
                    type='button'
                    onClick={() => onSectionClick(section.id)}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className='border-border bg-card pointer-events-none absolute bottom-3 left-1/2 z-10 flex w-max -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-1.5 shadow-lg sm:hidden'>
          <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
            reading
          </span>
          <span className='text-foreground text-xs font-medium'>{active.label}</span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
