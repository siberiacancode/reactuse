'use client'

import { useClickOutside, useDisclosure, useMergedRef, useSet } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';

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
  const selected = useSet<string>(['react']);

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => dropdownMenu.close());
  const panelRef = useMergedRef(clickOutsideRef);

  const selectedItems = FRAMEWORKS.filter((framework) => selected.has(framework.value));

  return (
    <section className='flex flex-col items-center'>
      <div className='flex w-full max-w-xs flex-col gap-1.5'>
        <label className='text-foreground text-sm font-medium' id='framework-label'>
          Frameworks
        </label>

        <div className='relative w-[250px]'>
          <div
            aria-expanded={dropdownMenu.opened}
            aria-haspopup='listbox'
            aria-labelledby='framework-label'
            className='border-border bg-card hover:bg-accent flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors'
            onClick={() => dropdownMenu.toggle()}
          >
            <span className='flex min-w-0 flex-1 flex-wrap items-center gap-1.5'>
              {selectedItems.length === 0 && (
                <span className='text-muted-foreground text-sm'>Select frameworks</span>
              )}
              {selectedItems.map((framework) => (
                <span
                  key={framework.value}
                  data-slot='badge'
                  data-variant='secondary'
                  onClick={(event) => {
                    event.stopPropagation();
                    selected.remove(framework.value);
                  }}
                >
                  <img
                    alt=''
                    className='size-3 dark:invert'
                    src={`https://cdn.simpleicons.org/${framework.logo}/000000`}
                  />
                  {framework.label}
                  <XIcon className='size-3' />
                </span>
              ))}
            </span>

            <ChevronDownIcon
              className={cn(
                'text-muted-foreground size-4 shrink-0 transition-transform',
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
                  onClick={() => selected.toggle(framework.value)}
                >
                  <img
                    alt=''
                    className='size-4 dark:invert'
                    src={`https://cdn.simpleicons.org/${framework.logo}/000000`}
                  />
                  {framework.label}
                  {selected.has(framework.value) && <CheckIcon className='ml-auto size-4' />}
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
