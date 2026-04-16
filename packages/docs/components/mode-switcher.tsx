/* eslint-disable react-dom/no-dangerously-set-innerhtml */
'use client';

import { Button } from '@docs/ui/button';
import { Kbd } from '@docs/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@docs/ui/tooltip';
import { useTheme } from 'next-themes';
import Script from 'next/script';
import * as React from 'react';

export const DARK_MODE_FORWARD_TYPE = 'dark-mode-forward';

export const ModeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleTheme]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className='group/toggle extend-touch-target size-8'
          size='icon'
          variant='ghost'
          onClick={toggleTheme}
        >
          <svg
            className='size-4.5'
            fill='none'
            height='24'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M0 0h24v24H0z' fill='none' stroke='none' />
            <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
            <path d='M12 3l0 18' />
            <path d='M12 9l4.65 -4.65' />
            <path d='M12 14.3l7.37 -7.37' />
            <path d='M12 19.6l8.85 -8.85' />
          </svg>
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className='flex items-center gap-2 pr-1'>
        Toggle Mode <Kbd>D</Kbd>
      </TooltipContent>
    </Tooltip>
  );
};

export const DarkModeScript = () => (
  <Script
    dangerouslySetInnerHTML={{
      __html: `
            (function() {
              // Forward D key
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${DARK_MODE_FORWARD_TYPE}',
                      key: e.key
                    }, '*');
                  }
                }
              });

            })();
          `
    }}
    id='dark-mode-listener'
    strategy='beforeInteractive'
  />
);
