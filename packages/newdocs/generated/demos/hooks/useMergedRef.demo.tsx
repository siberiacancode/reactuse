'use client'

import { useClickOutside, useDisclosure, useMeasure, useMergedRef } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const FRAMEWORKS = [
  { value: 'react', label: 'React', logo: 'react' },
  { value: 'vue', label: 'Vue', logo: 'vuedotjs' },
  { value: 'svelte', label: 'Svelte', logo: 'svelte' },
  { value: 'angular', label: 'Angular', logo: 'angular' },
  { value: 'solid', label: 'SolidJS', logo: 'solid' },
  { value: 'qwik', label: 'Qwik', logo: 'qwik' }
];

const Demo = () => {
  const dropdownMenu = useDisclosure();
  const [value, setValue] = useState('react');

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => dropdownMenu.close());
  const measure = useMeasure<HTMLDivElement>();
  const panelRef = useMergedRef(clickOutsideRef, measure.ref);

  const selected = FRAMEWORKS.find((framework) => framework.value === value);

  const onSelect = (next: string) => {
    setValue(next);
    dropdownMenu.close();
  };

  return (
    <section className='flex flex-col items-center'>
      <div className='flex w-full max-w-xs flex-col gap-1.5'>
        <label className='text-foreground text-sm font-medium' id='framework-label'>
          Framework
        </label>

        <div className='relative'>
          <div
            aria-expanded={dropdownMenu.opened}
            aria-haspopup='listbox'
            aria-labelledby='framework-label'
            className='border-border bg-card hover:bg-accent flex w-full min-w-[250px] cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors'
            onClick={() => dropdownMenu.toggle()}
          >
            <span className='flex items-center gap-2'>
              <img
                alt=''
                className='size-4 dark:invert'
                src={`https://cdn.simpleicons.org/${selected?.logo}/000000`}
              />
              <span className='text-foreground text-sm font-medium'>{selected?.label}</span>
            </span>
            <ChevronDownIcon
              className={cn(
                'text-muted-foreground size-4 transition-transform',
                dropdownMenu.opened && 'rotate-180'
              )}
            />
          </div>

          {dropdownMenu.opened && (
            <div
              ref={panelRef}
              className='absolute top-full right-0 left-0 mt-2'
              data-slot='dropdown-menu-content'
            >
              {FRAMEWORKS.map((framework) => (
                <div
                  key={framework.value}
                  data-slot='dropdown-menu-item'
                  onClick={() => onSelect(framework.value)}
                >
                  <img
                    alt=''
                    className='size-4 dark:invert'
                    src={`https://cdn.simpleicons.org/${framework.logo}/000000`}
                  />
                  {framework.label}
                  {framework.value === value && <CheckIcon className='ml-auto size-4' />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
