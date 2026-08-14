---
title: useMutationObserver
description: Hook that gives you mutation observer state
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768553242000
---

# useMutationObserver

Hook that gives you mutation observer state

## Demo

```tsx
import type { ClipboardEvent } from 'react';

import { useMutationObserver } from '@siberiacancode/reactuse';
import { FileTextIcon } from 'lucide-react';
import { useState } from 'react';

const INITIAL_TEXT =
  'reactuse is a collection of essential React hooks. Start typing here and watch the stats update as the content changes.';

const getStats = (text: string) => {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  const words = normalizedText.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  const characters = Array.from(text).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, characters, minutes };
};

const Demo = () => {
  const [stats, setStats] = useState(() => getStats(INITIAL_TEXT));

  const editor = useMutationObserver<HTMLDivElement>({
    childList: true,
    subtree: true,
    characterData: true,
    onChange: () => {
      const text = editor.ref.current?.textContent ?? '';
      setStats(getStats(text));
    }
  });

  const onPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase'>
        <FileTextIcon className='size-3.5' />
        Draft
      </div>

      <div
        contentEditable
        suppressContentEditableWarning
        ref={editor.ref}
        className='text-foreground min-h-36 rounded-lg text-base leading-relaxed outline-none'
        onPaste={onPaste}
      >
        {INITIAL_TEXT}
      </div>

      <div className='border-border text-muted-foreground flex gap-5 border-t pt-3 text-xs'>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>{stats.words}</span> words
        </span>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>{stats.characters}</span>{' '}
          characters
        </span>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>{stats.minutes}</span> min
          read
        </span>
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
npx useverse@latest add useMutationObserver
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The mutation observer callback type */
export type UseMutationObserverCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver
) => void;

/** The mutation observer options type */
export interface UseMutationObserverOptions extends MutationObserverInit {
  /** The enabled state of the mutation observer */
  enabled?: boolean;
  /** The callback to execute when mutation is detected */
  onChange?: UseMutationObserverCallback;
}

/** The mutation observer return type */
export interface UseMutationObserverReturn {
  /** The mutation observer instance */
  observer?: MutationObserver;
}

export interface UseMutationObserver {
  <Target extends Element>(
    options?: UseMutationObserverOptions,
    target?: never
  ): UseMutationObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseMutationObserverOptions): UseMutationObserverReturn;

  <Target extends Element>(
    callback: UseMutationObserverCallback,
    target?: never
  ): UseMutationObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, callback: UseMutationObserverCallback): UseMutationObserverReturn;
}

/**
 * @name useMutationObserver
 * @description - Hook that gives you mutation observer state
 * @category Sensors
 * @usage low
 *
 * @browserapi MutationObserver https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {boolean} [options.enabled=true] The enabled state of the mutation observer
 * @param {UseMutationObserverCallback} [options.onChange] The callback to execute when mutation is detected
 * @param {boolean} [options.attributes] Set to true if mutations to target's attributes are to be observed
 * @param {boolean} [options.characterData] Set to true if mutations to target's data are to be observed
 * @param {boolean} [options.childList] Set to true if mutations to target's children are to be observed
 * @param {boolean} [options.subtree] Set to true if mutations to not just target, but also target's descendants are to be observed
 * @returns {UseMutationObserverReturn} An object containing the mutation observer state
 *
 * @example
 * const { observer, stop } = useMutationObserver(ref, { childList: true });
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the mutation observer
 * @param {UseMutationObserverCallback} [options.onChange] The callback to execute when mutation is detected
 * @param {boolean} [options.attributes] Set to true if mutations to target's attributes are to be observed
 * @param {boolean} [options.characterData] Set to true if mutations to target's data are to be observed
 * @param {boolean} [options.childList] Set to true if mutations to target's children are to be observed
 * @param {boolean} [options.subtree] Set to true if mutations to not just target, but also target's descendants are to be observed
 * @returns {UseMutationObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, observer, stop } = useMutationObserver({ childList: true });
 *
 * @overload
 * @template Target The target element
 * @param {UseMutationObserverCallback} callback The callback to execute when mutation is detected
 * @returns {UseMutationObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, observer, stop } = useMutationObserver((mutations) => console.log(mutations));
 *
 * @overload
 * @param {UseMutationObserverCallback} callback The callback to execute when mutation is detected
 * @param {HookTarget} target The target element to observe
 * @returns {UseMutationObserverReturn} An object containing the mutation observer state
 *
 * @example
 * const { observer, stop } = useMutationObserver((mutations) => console.log(mutations), ref);
 */
export const useMutationObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onChange: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onChange: params[0] }
  ) as UseMutationObserverOptions | undefined;

  const callback = options?.onChange;
  const enabled = options?.enabled ?? true;

  const [observer, setObserver] = useState<MutationObserver>();

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new MutationObserver((mutations, observer) => {
      internalCallbackRef.current?.(mutations, observer);
    });

    setObserver(observer);
    observer.observe(element as Element, options);

    return () => {
      observer.disconnect();
    };
  }, [
    target && isTarget.getRawElement(target),
    internalRef.state,
    options?.childList,
    options?.attributes,
    options?.characterData,
    options?.subtree,
    options?.attributeOldValue,
    options?.characterDataOldValue,
    options?.attributeFilter,
    enabled
  ]);

  if (target) return { observer };
  return {
    ref: internalRef,
    observer
  };
}) as UseMutationObserver;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { observer, stop } = useMutationObserver(ref, { childList: true });
// or
const { ref, observer, stop } = useMutationObserver({ childList: true });
// or
const { ref, observer, stop } = useMutationObserver((mutations) => console.log(mutations));
// or
const { observer, stop } = useMutationObserver((mutations) => console.log(mutations), ref);
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type UseMutationObserverCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver
) => void;

export interface UseMutationObserverOptions extends MutationObserverInit {
  /** The enabled state of the mutation observer */
  enabled?: boolean;
  /** The callback to execute when mutation is detected */
  onChange?: UseMutationObserverCallback;
}

export interface UseMutationObserverReturn {
  /** The mutation observer instance */
  observer?: MutationObserver;
}

export interface UseMutationObserver {
  <Target extends Element>(
    options?: UseMutationObserverOptions,
    target?: never
  ): UseMutationObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseMutationObserverOptions): UseMutationObserverReturn;

  <Target extends Element>(
    callback: UseMutationObserverCallback,
    target?: never
  ): UseMutationObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, callback: UseMutationObserverCallback): UseMutationObserverReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to observe |
| options.enabled | `boolean` | true | The enabled state of the mutation observer |
| options.onChange | `UseMutationObserverCallback` | - | The callback to execute when mutation is detected |
| options.attributes | `boolean` | - | Set to true if mutations to target's attributes are to be observed |
| options.characterData | `boolean` | - | Set to true if mutations to target's data are to be observed |
| options.childList | `boolean` | - | Set to true if mutations to target's children are to be observed |
| options.subtree | `boolean` | - | Set to true if mutations to not just target, but also target's descendants are to be observed |

#### Returns

`UseMutationObserverReturn` - An object containing the mutation observer state

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.enabled | `boolean` | true | The enabled state of the mutation observer |
| options.onChange | `UseMutationObserverCallback` | - | The callback to execute when mutation is detected |
| options.attributes | `boolean` | - | Set to true if mutations to target's attributes are to be observed |
| options.characterData | `boolean` | - | Set to true if mutations to target's data are to be observed |
| options.childList | `boolean` | - | Set to true if mutations to target's children are to be observed |
| options.subtree | `boolean` | - | Set to true if mutations to not just target, but also target's descendants are to be observed |

#### Returns

`UseMutationObserverReturn & { ref: StateRef<Target> }` - A React ref to attach to the target element

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseMutationObserverCallback` | - | The callback to execute when mutation is detected |

#### Returns

`UseMutationObserverReturn & { ref: StateRef<Target> }` - A React ref to attach to the target element

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseMutationObserverCallback` | - | The callback to execute when mutation is detected |
| target | `HookTarget` | - | The target element to observe |

#### Returns

`UseMutationObserverReturn` - An object containing the mutation observer state