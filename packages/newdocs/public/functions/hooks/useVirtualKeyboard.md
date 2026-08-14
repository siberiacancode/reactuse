---
title: useVirtualKeyboard
description: Hook that manages virtual keyboard state
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# useVirtualKeyboard

Hook that manages virtual keyboard state

> Warning: This hook has a fallback for virtual keyboard detection. If the virtual keyboard is not supported, the methods will not work.

## Demo

```tsx
import { useField, useVirtualKeyboard } from '@siberiacancode/reactuse';
import { SendIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const virtualKeyboard = useVirtualKeyboard();
  const messageField = useField('');

  const message = messageField.watch();

  if (!virtualKeyboard.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div
        className={cn(
          'bg-card border-border flex items-center gap-2 rounded-full border p-1.5 transition-all duration-200',
          virtualKeyboard.opened && 'border-ring ring-ring/50 ring-3'
        )}
      >
        <input
          className='flex-1 rounded-full! border-none! bg-transparent px-3 text-sm shadow-none! ring-0! outline-none'
          placeholder='Message…'
          {...messageField.register()}
        />
        <button
          aria-label='Send'
          className='flex size-9 shrink-0 items-center justify-center rounded-full!'
          disabled={!message.trim()}
          type='button'
          onClick={() => messageField.reset()}
        >
          <SendIcon className='size-4' />
        </button>
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
npx useverse@latest add useVirtualKeyboard
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

declare global {
  interface Navigator {
    virtualKeyboard?: {
      boundingRect: DOMRect;
      overlaysContent: boolean;
      show: () => void;
      hide: () => void;
      addEventListener: (type: 'geometrychange', listener: EventListener) => void;
      removeEventListener: (type: 'geometrychange', listener: EventListener) => void;
    };
  }
}

/** The use virtual keyboard return type */
export interface UseVirtualKeyboardReturn {
  /** Whether the virtual keyboard is currently open */
  opened: boolean;
  /** Whether the VirtualKeyboard API is supported */
  supported: boolean;
  /** Change the overlays content */
  changeOverlaysContent: (overlaysContent: boolean) => void;
  /** Hide the virtual keyboard */
  hide: () => void;
  /** Show the virtual keyboard */
  show: () => void;
}

/**
 * @name useVirtualKeyboard
 * @description - Hook that manages virtual keyboard state
 * @category Browser
 * @usage low
 *
 * @browserapi VirtualKeyboard https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard
 *
 * @warning - This hook has a fallback for virtual keyboard detection. If the virtual keyboard is not supported, the methods will not work.
 *
 * @param {boolean} [initialValue=false] The initial state value for keyboard visibility
 * @returns {UseVirtualKeyboardReturn} An object containing keyboard state and control methods
 *
 * @example
 * const { opened, show, hide, supported, changeOverlaysContent } = useVirtualKeyboard();
 */
export const useVirtualKeyboard = (initialValue = false): UseVirtualKeyboardReturn => {
  const supported =
    (typeof window !== 'undefined' && 'visualViewport' in window && !!window.visualViewport) ||
    (typeof navigator !== 'undefined' &&
      'virtualKeyboard' in navigator &&
      !!navigator.virtualKeyboard);

  const [opened, setOpened] = useState(initialValue);

  const hide = () => {
    if (!navigator.virtualKeyboard) return;
    navigator.virtualKeyboard.hide();
    setOpened(false);
  };

  const show = () => {
    if (!navigator.virtualKeyboard) return;
    navigator.virtualKeyboard.show();
    setOpened(true);
  };

  const changeOverlaysContent = (overlaysContent: boolean) => {
    if (!navigator.virtualKeyboard) return;
    navigator.virtualKeyboard.overlaysContent = overlaysContent;
  };

  useEffect(() => {
    if (!supported) return;

    const onResize = () => setOpened(window.screen.height - 300 > window.visualViewport!.height);

    const onGeometryChange = (event: Event) => {
      const { height } = (event.target as any).boundingRect as DOMRect;
      setOpened(height > 0);
    };

    if (navigator.virtualKeyboard) navigator.virtualKeyboard.overlaysContent = true;

    navigator.virtualKeyboard &&
      navigator.virtualKeyboard.addEventListener('geometrychange', onGeometryChange);
    window.visualViewport && window.visualViewport.addEventListener('resize', onResize);

    return () => {
      navigator.virtualKeyboard &&
        navigator.virtualKeyboard.removeEventListener('geometrychange', onGeometryChange);
      window.visualViewport && window.visualViewport.removeEventListener('resize', onResize);
    };
  }, []);

  return {
    opened,
    show,
    hide,
    changeOverlaysContent,
    supported
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { opened, show, hide, supported, changeOverlaysContent } = useVirtualKeyboard();
```

## Type Declarations

```tsx
interface Navigator {
    virtualKeyboard?: {
      boundingRect: DOMRect;
      overlaysContent: boolean;
      show: () => void;
      hide: () => void;
      addEventListener: (type: 'geometrychange', listener: EventListener) => void;
      removeEventListener: (type: 'geometrychange', listener: EventListener) => void;
    };
  }

export interface UseVirtualKeyboardReturn {
  /** Whether the virtual keyboard is currently open */
  opened: boolean;
  /** Whether the VirtualKeyboard API is supported */
  supported: boolean;
  /** Change the overlays content */
  changeOverlaysContent: (overlaysContent: boolean) => void;
  /** Hide the virtual keyboard */
  hide: () => void;
  /** Show the virtual keyboard */
  show: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `boolean` | false | The initial state value for keyboard visibility |

### Returns

`UseVirtualKeyboardReturn` - An object containing keyboard state and control methods