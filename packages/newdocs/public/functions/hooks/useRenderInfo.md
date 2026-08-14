---
title: useRenderInfo
description: Hook for getting information about component rerender
category: debug
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useRenderInfo

Hook for getting information about component rerender

## Demo

```tsx
import { useRenderInfo, useRerender } from '@siberiacancode/reactuse';
import { ActivityIcon, RefreshCwIcon } from 'lucide-react';

const formatTime = (timestamp: number | null) => {
  if (!timestamp) return 'never';

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const Demo = () => {
  const rerender = useRerender();
  const renderInfo = useRenderInfo('PreviewCard', false);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
            <ActivityIcon className='size-5' />
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>{renderInfo.component}</span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              The hook tracks how many times this component rendered and when the last render
              happened.
            </span>
          </div>
        </div>

        <div className='border-border grid grid-cols-2 gap-3 border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Last gap
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {renderInfo.sinceLast}ms
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Time</span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {formatTime(renderInfo.timestamp)}
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Renders
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {renderInfo.renders}
            </span>
          </div>

          <button data-size='sm' data-variant='outline' type='button' onClick={rerender}>
            <RefreshCwIcon className='size-3.5' />
            Re-render
          </button>
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
npx useverse@latest add useRenderInfo
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef } from 'react';

/** The use render info return type */
export interface UseRenderInfoReturn {
  /** The name of the component */
  component: string;
  /** The number of renders */
  renders: number;
  /** The time since the last render */
  sinceLast: number;
  /** The timestamp of the render */
  timestamp: number | null;
}

/**
 * @name useRenderInfo
 * @description - Hook for getting information about component rerender
 * @category Debug
 * @usage low
 *
 * @param {string} [name='Unknown'] Component name
 * @param {boolean} [log=true] Toggle logging
 * @returns {UseRenderInfoReturn} An object containing rerender information
 *
 * @example
 * const rerenderInfo = useRenderInfo('Component');
 */
export const useRenderInfo = (name: string = 'Unknown', log: boolean = true) => {
  const renderInfoRef = useRef<UseRenderInfoReturn>({
    component: name,
    renders: 0,
    timestamp: Date.now(),
    sinceLast: 0
  });
  const now = Date.now();

  renderInfoRef.current.renders += 1;
  renderInfoRef.current.sinceLast = renderInfoRef.current.timestamp
    ? now - renderInfoRef.current.timestamp
    : 0;
  renderInfoRef.current.timestamp = now;

  if (log) {
    console.group(`${name} info, render number: ${renderInfoRef.current.renders}`);
    console.log(`Timestamp: ${renderInfoRef.current.timestamp}`);
    console.log(`Since last render: ${renderInfoRef.current.sinceLast}`);
    console.log(`Renders: ${renderInfoRef.current.renders}`);
    console.dir(renderInfoRef.current);
    console.groupEnd();
  }

  return renderInfoRef.current;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const rerenderInfo = useRenderInfo('Component');
```

## Type Declarations

```tsx
export interface UseRenderInfoReturn {
  /** The name of the component */
  component: string;
  /** The number of renders */
  renders: number;
  /** The time since the last render */
  sinceLast: number;
  /** The timestamp of the render */
  timestamp: number | null;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| name | `string` | 'Unknown' | Component name |
| log | `boolean` | true | Toggle logging |

### Returns

`UseRenderInfoReturn` - An object containing rerender information