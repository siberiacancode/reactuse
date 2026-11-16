'use client'

import { useClickOutside, useDisclosure } from '@siberiacancode/reactuse';
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';

const Demo = () => {
  const dropdownMenu = useDisclosure();
  const ref = useClickOutside<HTMLDivElement>(() => dropdownMenu.close());

  return (
    <section className='flex flex-col items-center'>
      <div className='relative w-full max-w-xs'>
        <div
          className='flex w-full cursor-pointer items-center justify-between gap-3 transition-colors'
          onClick={() => dropdownMenu.toggle()}
        >
          <div className='relative shrink-0'>
            <div className='flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white'>
              SC
            </div>
            <span className='ring-background absolute right-0 bottom-0 block size-2.5 rounded-full bg-green-500 ring-2' />
          </div>

          <div className='flex flex-col items-start gap-0.5'>
            <span className='text-sm font-medium'>siberiacancode</span>
            <span className='text-muted-foreground text-xs'>Opensource team</span>
          </div>
        </div>

        {dropdownMenu.opened && (
          <div
            ref={ref}
            className='absolute top-full right-0 left-0 mt-4'
            data-slot='dropdown-menu-content'
          >
            <div data-slot='dropdown-menu-item' onClick={dropdownMenu.close}>
              <UserIcon />
              Profile
            </div>
            <div data-slot='dropdown-menu-item' onClick={dropdownMenu.close}>
              <CreditCardIcon />
              Billing
            </div>
            <div data-slot='dropdown-menu-item' onClick={dropdownMenu.close}>
              <SettingsIcon />
              Settings
              <span className='text-xs' data-slot='dropdown-menu-shortcut'>
                ⌘S
              </span>
            </div>
            <div data-slot='dropdown-menu-separator' />
            <div
              data-slot='dropdown-menu-item'
              data-variant='destructive'
              onClick={dropdownMenu.close}
            >
              <LogOutIcon />
              Sign out
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
