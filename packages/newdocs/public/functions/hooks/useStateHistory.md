---
title: useStateHistory
description: Hook that manages state with history functionality
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useStateHistory

Hook that manages state with history functionality

## Demo

```tsx
import {
  useClickOutside,
  useDebounceCallback,
  useDisclosure,
  useStateHistory
} from '@siberiacancode/reactuse';
import { CheckIcon, HistoryIcon } from 'lucide-react';
import { useState } from 'react';

const INITIAL = 'Ship faster with reactuse — a collection of essential React hooks.';

const Demo = () => {
  const stateHistory = useStateHistory(INITIAL);
  const [text, setText] = useState(INITIAL);

  const menu = useDisclosure();
  const menuRef = useClickOutside<HTMLDivElement>(() => menu.close());

  const save = useDebounceCallback((value: string) => {
    stateHistory.set(value);
  }, 800);

  const onChange = (value: string) => {
    setText(value);

    save(value);
  };

  const jumpTo = (target: number) => {
    const delta = target - stateHistory.index;
    if (delta < 0) stateHistory.back(-delta);
    if (delta > 0) stateHistory.forward(delta);
    setText(stateHistory.history[target]);
    menu.close();
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-2 p-4'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-sm font-medium'>Draft</span>

        <div className='relative'>
          <button
            aria-expanded={menu.opened}
            data-size='sm'
            data-variant='ghost'
            type='button'
            onClick={() => menu.toggle()}
          >
            <HistoryIcon className='size-3.5' />
            History
          </button>

          {menu.opened && (
            <div
              ref={menuRef}
              className='absolute top-full right-0 z-10 mt-2 w-72'
              data-slot='dropdown-menu-content'
            >
              <div data-slot='dropdown-menu-label'>Version history</div>
              <div className='no-scrollbar max-h-56 overflow-y-auto'>
                {stateHistory.history.map((version, index) => {
                  const active = index === stateHistory.index;
                  return (
                    <div key={index} data-slot='dropdown-menu-item' onClick={() => jumpTo(index)}>
                      <span className='text-muted-foreground w-8 shrink-0 text-xs tabular-nums'>
                        v{index + 1}
                      </span>
                      <span className='truncate'>{version || 'Empty'}</span>
                      {active && <CheckIcon className='text-primary ml-auto size-4 shrink-0' />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <textarea
        className='no-scrollbar min-h-40 resize-none'
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
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
npx useverse@latest add useStateHistory
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useReducer } from 'react';

/** The use state history hook return type */
interface UseStateHistoryReturn<Value> {
  /** True if a redo operation can be performed */
  canRedo: boolean;
  /** True if an undo operation can be performed */
  canUndo: boolean;
  /** All history values */
  history: Value[];
  /** Current index in history */
  index: number;
  /** Current value */
  value: Value;
  /** Go back specified number of steps in history (default: 1) */
  back: (steps?: number) => void;
  /** Go forward specified number of steps in history (default: 1) */
  forward: (steps?: number) => void;
  /** Redo the last change */
  redo: () => void;
  /** Reset history to initial state */
  reset: () => void;
  /** Set a new value */
  set: (value: Value) => void;
  /** Undo the last change */
  undo: () => void;
}

export type StateHistoryAction<Value> =
  | { type: 'BACK'; payload: { steps: number } }
  | { type: 'FORWARD'; payload: { steps: number } }
  | { type: 'REDO' }
  | { type: 'RESET'; payload: { initialValue: Value; capacity: number } }
  | { type: 'SET'; payload: { value: Value; capacity: number } }
  | { type: 'UNDO' };

export interface StateHistory<Value> {
  currentIndex: number;
  history: Value[];
  redoStack: Value[][];
  undoStack: Value[][];
}

export const stateHistoryReducer = <Value>(
  state: StateHistory<Value>,
  action: StateHistoryAction<Value>
): StateHistory<Value> => {
  switch (action.type) {
    case 'SET': {
      const { value, capacity } = action.payload;

      const newHistory = [...state.history.slice(0, state.currentIndex + 1), value];
      if (newHistory.length > capacity) {
        newHistory.shift();
      }

      const newUndoStack = [state.history, ...state.undoStack];
      if (newUndoStack.length > capacity) {
        newUndoStack.pop();
      }

      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
        undoStack: newUndoStack,
        redoStack: []
      };
    }

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;

      return {
        history: state.undoStack[0],
        currentIndex: state.undoStack[0].length - 1,
        undoStack: state.undoStack.slice(1),
        redoStack: [state.history, ...state.redoStack]
      };
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;

      return {
        history: state.redoStack[0],
        currentIndex: state.redoStack[0].length - 1,
        undoStack: [state.history, ...state.undoStack],
        redoStack: state.redoStack.slice(1)
      };
    }

    case 'BACK': {
      const { steps } = action.payload;
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - steps)
      };
    }

    case 'FORWARD': {
      const { steps } = action.payload;
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + steps, state.history.length - 1)
      };
    }

    case 'RESET': {
      const { initialValue, capacity } = action.payload;
      if (state.history.length === 1) return state;

      const newUndoStack = [state.history, ...state.undoStack];
      if (newUndoStack.length > capacity) {
        newUndoStack.pop();
      }

      return {
        history: [initialValue],
        currentIndex: 0,
        undoStack: newUndoStack,
        redoStack: []
      };
    }

    default:
      throw new Error('Unsupported action type');
  }
};

/**
 * @name useStateHistory
 * @description - Hook that manages state with history functionality
 * @category State
 * @usage medium
 *
 * @param {Value} initialValue - The initial value to start the history with
 * @param {number} [capacity=10] - Maximum number of history entries and undo actions to keep
 * @returns {UseStateHistoryReturn<Value>} Object containing current value, history array and control methods
 *
 * @example
 * const { value, history, index, set, back, forward, reset, undo, redo, canUndo, canRedo } = useStateHistory(0);
 */
export const useStateHistory = <Value>(
  initialValue: Value,
  capacity = 10
): UseStateHistoryReturn<Value> => {
  const [state, dispatch] = useReducer(stateHistoryReducer<Value>, {
    history: [initialValue],
    currentIndex: 0,
    undoStack: [],
    redoStack: []
  });

  const value = state.history[state.currentIndex];
  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;

  const set = (value: Value) =>
    dispatch({
      type: 'SET',
      payload: { value, capacity }
    });

  const undo = () => dispatch({ type: 'UNDO' });

  const redo = () => dispatch({ type: 'REDO' });

  const back = (steps = 1) => dispatch({ type: 'BACK', payload: { steps } });

  const forward = (steps = 1) => dispatch({ type: 'FORWARD', payload: { steps } });

  const reset = () => dispatch({ type: 'RESET', payload: { initialValue, capacity } });

  return {
    history: state.history,
    value,
    set,
    index: state.currentIndex,
    back,
    forward,
    reset,
    undo,
    redo,
    canUndo,
    canRedo
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, history, index, set, back, forward, reset, undo, redo, canUndo, canRedo } = useStateHistory(0);
```

## Type Declarations

```tsx
interface UseStateHistoryReturn<Value> {
  /** True if a redo operation can be performed */
  canRedo: boolean;
  /** True if an undo operation can be performed */
  canUndo: boolean;
  /** All history values */
  history: Value[];
  /** Current index in history */
  index: number;
  /** Current value */
  value: Value;
  /** Go back specified number of steps in history (default: 1) */
  back: (steps?: number) => void;
  /** Go forward specified number of steps in history (default: 1) */
  forward: (steps?: number) => void;
  /** Redo the last change */
  redo: () => void;
  /** Reset history to initial state */
  reset: () => void;
  /** Set a new value */
  set: (value: Value) => void;
  /** Undo the last change */
  undo: () => void;
}

export type StateHistoryAction<Value> =
  | { type: 'BACK'; payload: { steps: number } }
  | { type: 'FORWARD'; payload: { steps: number } }
  | { type: 'REDO' }
  | { type: 'RESET'; payload: { initialValue: Value; capacity: number } }
  | { type: 'SET'; payload: { value: Value; capacity: number } }
  | { type: 'UNDO' };

export interface StateHistory<Value> {
  currentIndex: number;
  history: Value[];
  redoStack: Value[][];
  undoStack: Value[][];
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `Value` | - | The initial value to start the history with |
| capacity | `number` | 10 | Maximum number of history entries and undo actions to keep |

### Returns

`UseStateHistoryReturn<Value>` - Object containing current value, history array and control methods