---
title: useRenderCount
description: Hook returns count component render times
category: debug
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useRenderCount

Hook returns count component render times

## Demo

```tsx
import { useRenderCount } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const renderCount = useRenderCount();
  const [value, setValue] = useState('');

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <div className='border-primary relative rounded-xl border-2 p-3 transition-colors duration-300'>
        <span className='bg-primary text-primary-foreground absolute -top-3 left-3 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums'>
          x{renderCount}
        </span>

        <input
          placeholder='Type to re-render...'
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
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
npx useverse@latest add useRenderCount
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

/**
 * @name useRenderCount
 * @description - Hook returns count component render times
 * @category Debug
 * @usage low
 *
 * @returns {number} A number which determines how many times component renders
 *
 * @example
 * const renderCount = useRenderCount();
 */
export const useRenderCount = () => {
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
  });

  return renderCountRef.current;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const renderCount = useRenderCount();
```

## API

### Returns

`number` - A number which determines how many times component renders