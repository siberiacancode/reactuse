---
title: useList
description: Hook that provides state and helper methods to manage a list of items
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useList

Hook that provides state and helper methods to manage a list of items

## Demo

```tsx
import type { SubmitEvent } from 'react';

import { useList } from '@siberiacancode/reactuse';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Todo {
  done: boolean;
  id: string;
  text: string;
}

const Demo = () => {
  const todos = useList<Todo>([
    { id: '1', text: 'Read reactuse docs', done: true },
    { id: '2', text: 'Try useList in a side project', done: false },
    { id: '3', text: 'Star siberiacancode/reactuse on GitHub', done: false }
  ]);

  const [value, setValue] = useState('');

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    todos.push({ id: crypto.randomUUID(), text, done: false });
    setValue('');
  };

  const onToggle = (index: number, todo: Todo) => {
    todos.updateAt(index, { ...todo, done: !todo.done });
  };

  const remaining = todos.value.filter((todo) => !todo.done).length;

  return (
    <section className='flex w-full max-w-sm flex-col gap-3 p-4'>
      <h2 className='text-foreground text-sm font-semibold'>Today's tasks</h2>

      <form onSubmit={onSubmit}>
        <div className='flex items-center gap-2'>
          <input
            className='border-border bg-card text-foreground placeholder:text-muted-foreground flex-1 rounded-md border px-3 py-2 text-sm outline-none'
            placeholder='What needs to be done?'
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button disabled={!value.trim()} type='submit'>
            Add
          </button>
        </div>
      </form>

      <div className='flex flex-col'>
        {todos.value.map((todo, index) => (
          <div
            key={todo.id}
            className='group hover:bg-muted/40 -mx-2 flex items-center gap-3 rounded-md px-1 py-2 transition-colors'
          >
            <label className='flex shrink-0 cursor-pointer items-center'>
              <input
                checked={todo.done}
                className='peer sr-only'
                type='checkbox'
                onChange={() => onToggle(index, todo)}
              />
              <span
                className={cn(
                  'border-border peer-checked:border-foreground peer-checked:bg-foreground flex size-4 items-center justify-center rounded-[5px] border transition-colors'
                )}
              >
                {todo.done && <CheckIcon className='text-background size-3' strokeWidth={3.5} />}
              </span>
            </label>

            <span
              className={cn(
                'flex-1 text-sm transition-colors',
                todo.done ? 'text-muted-foreground line-through' : 'text-foreground'
              )}
            >
              {todo.text}
            </span>

            <button
              aria-label='Remove'
              className='opacity-0 transition-opacity group-hover:opacity-100'
              data-size='icon'
              data-variant='ghost'
              type='button'
              onClick={() => todos.removeAt(index)}
            >
              <XIcon className='size-3' />
            </button>
          </div>
        ))}
      </div>

      <span className='text-muted-foreground px-1 text-[10px]'>
        {!remaining && 'All done — nice work ✨'}
        {remaining && `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`}
      </span>
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
npx useverse@latest add useList
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

/** The use list return type */
export interface UseListReturn<Item> {
  /** The current list of items */
  value: Item[];
  /** Clears the list */
  clear: () => void;
  /** Inserts an item at the specified index */
  insertAt: (insertAtIndex: number, item: Item) => void;
  /** Adds an item to the list */
  push: (item: Item) => void;
  /** Removes an item from the list */
  removeAt: (removeAtIndex: number) => void;
  /** Sets the list of items */
  set: (list: Item[]) => void;
  /** Updates an item at the specified index */
  updateAt: (updateAtIndex: number, item: Item) => void;
}

/**
 * @name useList
 * @description - Hook that provides state and helper methods to manage a list of items
 * @category State
 * @usage medium
 *
 * @template Item The type of the item
 * @param {Item[] | (() => Item[])} initialList The initial list of items
 * @returns {UseListReturn} An object containing the current list and functions to interact with the list
 *
 * @example
 * const { value, set, push, removeAt, insertAt, updateAt, clear } = useList();
 */
export const useList = <Item>(initialList: Item[] = []) => {
  const [list, setList] = useState(initialList);

  const push = (item: Item) => setList((prevList) => [...prevList, item]);

  const removeAt = (removeAtIndex: number) =>
    setList((prevList) => [
      ...prevList.slice(0, removeAtIndex),
      ...prevList.slice(removeAtIndex + 1)
    ]);

  const insertAt = (insertAtIndex: number, item: Item) =>
    setList((l) => [...l.slice(0, insertAtIndex), item, ...l.slice(insertAtIndex)]);

  const updateAt = (updateAtIndex: number, item: Item) =>
    setList((prevList) =>
      prevList.map((element, index) => (index === updateAtIndex ? item : element))
    );

  const clear = () => setList([]);

  const reset = () => setList(initialList);

  return {
    value: list,
    set: setList,
    push,
    removeAt,
    insertAt,
    updateAt,
    clear,
    reset
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set, push, removeAt, insertAt, updateAt, clear } = useList();
```

## Type Declarations

```tsx
export interface UseListReturn<Item> {
  /** The current list of items */
  value: Item[];
  /** Clears the list */
  clear: () => void;
  /** Inserts an item at the specified index */
  insertAt: (insertAtIndex: number, item: Item) => void;
  /** Adds an item to the list */
  push: (item: Item) => void;
  /** Removes an item from the list */
  removeAt: (removeAtIndex: number) => void;
  /** Sets the list of items */
  set: (list: Item[]) => void;
  /** Updates an item at the specified index */
  updateAt: (updateAtIndex: number, item: Item) => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialList | `Item[] \| (() => Item[])` | - | The initial list of items |

### Returns

`UseListReturn` - An object containing the current list and functions to interact with the list