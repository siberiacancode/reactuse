---
title: useWindowFocus
description: Hook that provides the current focus state of the window
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782054576000
---

# useWindowFocus

Hook that provides the current focus state of the window

## Demo

```tsx
import { useWindowFocus } from '@siberiacancode/reactuse';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Demo = () => {
  const focused = useWindowFocus();

  return (
    <section className='flex flex-col p-4'>
      <div className='bg-card flex w-fit items-center gap-3 rounded-xl p-4'>
        <div className='bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg'>
          {focused ? <EyeIcon className='size-5' /> : <EyeOffIcon className='size-5' />}
        </div>

        <div className='flex flex-col leading-tight'>
          <span className='text-foreground text-sm font-medium whitespace-nowrap'>
            {focused ? "You're viewing this page" : 'You left this tab'}
          </span>
          <span className='text-muted-foreground text-xs whitespace-nowrap'>
            {focused ? 'The tab is active and in focus' : 'Come back anytime to continue'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useWindowFocus
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

/**
 * @name useWindowFocus
 * @description - Hook that provides the current focus state of the window
 * @category Sensors
 * @usage low
 *
 * @returns {boolean} The current focus state of the window
 *
 * @example
 * const focused = useWindowFocus();
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useWindowFocus.html}
 */
export const useWindowFocus = () => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return focused;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const focused = useWindowFocus();
```

## API

### Returns

`boolean` - The current focus state of the window