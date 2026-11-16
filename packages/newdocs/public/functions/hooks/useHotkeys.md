---
title: useHotkeys
description: Hook that listens for hotkeys
category: sensors
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782722064000
---

# useHotkeys

Hook that listens for hotkeys

## Demo

```tsx
import { useDisclosure, useField, useHotkeys, useKeyPress } from '@siberiacancode/reactuse';
import { FileTextIcon, HomeIcon, PlusIcon, SearchIcon, SettingsIcon } from 'lucide-react';

const COMMANDS = [
  {
    id: 'home',
    label: 'Go to home',
    group: 'Navigation',
    hotkey: 'control+h',
    shortcut: ['Ctrl', 'H'],
    icon: HomeIcon
  },
  {
    id: 'projects',
    label: 'Go to projects',
    group: 'Navigation',
    hotkey: 'control+p',
    shortcut: ['Ctrl', 'P'],
    icon: FileTextIcon
  },
  {
    id: 'new',
    label: 'Create new document',
    group: 'Actions',
    hotkey: 'control+n',
    shortcut: ['Ctrl', 'N'],
    icon: PlusIcon
  },
  {
    id: 'settings',
    label: 'Open settings',
    group: 'Actions',
    hotkey: 'control+s',
    shortcut: ['Ctrl', 'S'],
    icon: SettingsIcon
  }
] as const;

type Command = (typeof COMMANDS)[number];

const matchesCommand = (command: Command, query: string) => {
  if (!query) return true;
  const haystack = [command.label, command.group, ...command.shortcut].join(' ').toLowerCase();
  return haystack.includes(query);
};

interface CommandItemProps {
  command: Command;
  onRun: (command: Command) => void;
}

const CommandItem = ({ command, onRun }: CommandItemProps) => {
  useHotkeys(command.hotkey, () => onRun(command));

  return (
    <button
      className='hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors'
      data-variant='unstyled'
      type='button'
      onClick={() => onRun(command)}
    >
      <command.icon className='text-muted-foreground size-4 shrink-0' />
      <span className='text-foreground flex-1 text-left text-sm'>{command.label}</span>
      <div className='flex items-center gap-1'>
        {command.shortcut.map((key, index) => (
          <kbd
            key={index}
            className='border-border bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded border px-1.5 font-mono text-[10px] font-medium'
          >
            {key}
          </kbd>
        ))}
      </div>
    </button>
  );
};

const Demo = () => {
  const palette = useDisclosure();
  const search = useField('');

  const runCommand = () => {
    palette.close();
    search.setValue('');
  };

  useHotkeys('ctrl+C', () => palette.open());
  useKeyPress('Escape', () => palette.close());

  const query = search.watch().trim().toLowerCase();
  const filtered = COMMANDS.filter((command) => matchesCommand(command, query));
  const groups = [...new Set(filtered.map(({ group }) => group))];

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        className='border-border bg-card flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2'
        onClick={palette.open}
      >
        <div className='flex items-center gap-2'>
          <SearchIcon className='text-muted-foreground size-4' />
          <span className='text-muted-foreground text-sm'>Search commands...</span>
        </div>

        <button type='button'>CtrlC</button>
      </div>

      {palette.opened && (
        <div
          className='animate-in fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-sm duration-150'
          onClick={palette.close}
        >
          <div
            className='animate-in fade-in slide-in-from-top-2 border-border bg-card flex w-full max-w-md flex-col overflow-hidden rounded-xl border p-2 shadow-2xl duration-150'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='border-border relative border-b'>
              <SearchIcon className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
              <input
                autoFocus
                className='text-foreground placeholder:text-muted-foreground w-full bg-transparent py-3! pl-8! text-sm outline-none'
                placeholder='Type a command or search...'
                {...search.register()}
              />
            </div>

            <div className='mt-2'>
              {!filtered.length && (
                <div className='text-muted-foreground py-8 text-center text-sm'>
                  No commands found
                </div>
              )}

              {groups.map((group) => (
                <div key={group} className='mb-1'>
                  <div className='text-muted-foreground px-3 py-1.5 text-[10px] tracking-wider uppercase'>
                    {group}
                  </div>
                  {filtered
                    .filter((command) => command.group === group)
                    .map((command) => (
                      <CommandItem key={command.id} command={command} onRun={runCommand} />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
npx useverse@latest add useHotkeys
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use hotkeys params type */
export interface UseHotkeysOptions {
  /** Enable or disable the event listeners */
  enabled?: boolean;
  /** The callback function to execute when hotkey is pressed */
  onChange?: (event: KeyboardEvent) => void;
}

export interface KeyboardModifiers {
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  mod: boolean;
  shift: boolean;
}

export interface Hotkey extends KeyboardModifiers {
  key?: string;
}

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean;

const KEY_NAME_MAP: Record<string, string> = {
  ' ': 'space',
  arrowleft: 'arrowleft',
  arrowright: 'arrowright',
  arrowup: 'arrowup',
  arrowdown: 'arrowdown',
  escape: 'escape',
  esc: 'escape',
  enter: 'enter',
  return: 'enter',
  tab: 'tab',
  backspace: 'backspace',
  delete: 'delete',
  insert: 'insert',
  home: 'home',
  end: 'end',
  pageup: 'pageup',
  pagedown: 'pagedown',
  '+': 'plus',
  '-': 'minus',
  '*': 'asterisk',
  '/': 'slash'
};

const normalizeKey = (key: string) => {
  const lowerKey = key
    .replace(/^Key/, '')
    .replace(/^Digit/, '')
    .toLowerCase();
  return KEY_NAME_MAP[lowerKey] ?? lowerKey;
};

export const parseHotkey = (hotkey: string): Hotkey => {
  const keys = hotkey
    .toLowerCase()
    .split('+')
    .map((part) => part.trim());

  const modifiers: KeyboardModifiers = {
    alt: keys.includes('alt'),
    ctrl: keys.includes('ctrl') || keys.includes('control'),
    meta: keys.includes('meta') || keys.includes('cmd') || keys.includes('command'),
    mod: keys.includes('mod'),
    shift: keys.includes('shift')
  };

  const reservedKeys = ['alt', 'ctrl', 'control', 'meta', 'cmd', 'command', 'shift', 'mod'];

  const freeKey = keys.find((key) => key && !reservedKeys.includes(key));

  return {
    ...modifiers,
    key: freeKey
  };
};

const isHotkeyMatch = (hotkey: Hotkey, event: KeyboardEvent) => {
  const { alt, ctrl, meta, mod, shift, key } = hotkey;
  const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey, code: pressedCode } = event;

  if (alt !== altKey) {
    return false;
  }

  if (mod) {
    if (!ctrlKey && !metaKey) {
      return false;
    }
  } else {
    if (ctrl !== ctrlKey) {
      return false;
    }
    if (meta !== metaKey) {
      return false;
    }
  }

  if (shift !== shiftKey) {
    return false;
  }

  if (key && normalizeKey(pressedKey ?? pressedCode) === normalizeKey(key)) {
    return true;
  }

  return false;
};

export const getHotkeyMatcher =
  (hotkey: string): CheckHotkeyMatch =>
  (event) =>
    isHotkeyMatch(parseHotkey(hotkey), event);

/** The hotkeys string type */
export type UseHotkeysHotkeys = string;

/** The hotkey key information */
export interface UseHotkeysKey {
  /** The alias for the key */
  alias: string;
  /** The key code */
  code: string;
  /** The key value */
  key: string;
}

export interface UseHotkeys {
  (target: HookTarget, hotkeys: UseHotkeysHotkeys, options?: UseHotkeysOptions): void;

  (
    target: HookTarget,
    hotkeys: UseHotkeysHotkeys,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions
  ): void;

  <Target extends Element>(
    hotkeys: UseHotkeysHotkeys,
    options?: UseHotkeysOptions,
    target?: never
  ): StateRef<Target>;

  <Target extends Element>(
    hotkeys: UseHotkeysHotkeys,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions,
    target?: never
  ): StateRef<Target>;
}

/**
 * @name useHotkeys
 * @description - Hook that listens for hotkeys
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to attach the event listener to
 * @param {string} hotkeys The hotkey to listen for
 * @param {UseHotkeysOptions} [options] The options for the hook
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @param {(event: KeyboardEvent) => void} [options.onChange] The callback function to execute when hotkey is pressed
 * @returns {void}
 *
 * @example
 * useHotkeys(ref, 'ctrl+a', { onChange: () => console.log('hotkey pressed') });
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to attach the event listener to
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {void}
 *
 * @example
 * useHotkeys(ref, 'ctrl+a', () => console.log('hotkey pressed'));
 *
 * @overload
 * @template Target The target element
 * @param {string} hotkeys The hotkey to listen for
 * @param {UseHotkeysOptions} [options] The options for the hook
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @param {(event: KeyboardEvent) => void} [options.onChange] The callback function to execute when hotkey is pressed
 * @returns {StateRef<Target>} A reference to the target element
 *
 * @example
 * const ref = useHotkeys('ctrl+a', { onChange: () => console.log('hotkey pressed') });
 *
 * @overload
 * @template Target The target element
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {StateRef<Target>} A reference to the target element
 *
 * @example
 * const ref = useHotkeys('ctrl+a', () => console.log('hotkey pressed'));
 */
export const useHotkeys = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const hotkeys = (target ? params[1] : params[0]) as UseHotkeysHotkeys;
  const options = (
    target
      ? typeof params[2] === 'object'
        ? params[2]
        : { ...params[3], onChange: params[2] }
      : typeof params[1] === 'object'
        ? params[1]
        : { ...params[2], onChange: params[1] }
  ) as UseHotkeysOptions | undefined;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const internalRef = useRefState<Element | Window>();
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    const eventTarget =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element | Window) ?? window;
    if (!eventTarget) return;

    const matchers = hotkeys
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean)
      .map(getHotkeyMatcher);

    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return;

      const isMatch = matchers.some((matcher) => matcher(event));
      if (!isMatch) return;

      event.preventDefault();
      optionsRef.current?.onChange?.(event);
    };

    eventTarget.addEventListener('keydown', onKeyDown as EventListener);

    return () => {
      eventTarget.removeEventListener('keydown', onKeyDown as EventListener);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled, hotkeys]);

  if (target) return;
  return internalRef;
}) as UseHotkeys;
```

Update the import paths to match your project setup.

## Usage

```tsx
useHotkeys(ref, 'ctrl+a', { onChange: () => console.log('hotkey pressed') });
// or
useHotkeys(ref, 'ctrl+a', () => console.log('hotkey pressed'));
// or
const ref = useHotkeys('ctrl+a', { onChange: () => console.log('hotkey pressed') });
// or
const ref = useHotkeys('ctrl+a', () => console.log('hotkey pressed'));
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseHotkeysOptions {
  /** Enable or disable the event listeners */
  enabled?: boolean;
  /** The callback function to execute when hotkey is pressed */
  onChange?: (event: KeyboardEvent) => void;
}

export interface KeyboardModifiers {
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  mod: boolean;
  shift: boolean;
}

export interface Hotkey extends KeyboardModifiers {
  key?: string;
}

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean;

export type UseHotkeysHotkeys = string;

export interface UseHotkeysKey {
  /** The alias for the key */
  alias: string;
  /** The key code */
  code: string;
  /** The key value */
  key: string;
}

export interface UseHotkeys {
  (target: HookTarget, hotkeys: UseHotkeysHotkeys, options?: UseHotkeysOptions): void;

  (
    target: HookTarget,
    hotkeys: UseHotkeysHotkeys,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions
  ): void;

  <Target extends Element>(
    hotkeys: UseHotkeysHotkeys,
    options?: UseHotkeysOptions,
    target?: never
  ): StateRef<Target>;

  <Target extends Element>(
    hotkeys: UseHotkeysHotkeys,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions,
    target?: never
  ): StateRef<Target>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | window | The target element to attach the event listener to |
| hotkeys | `string` | - | The hotkey to listen for |
| options | `UseHotkeysOptions` | - | The options for the hook |
| options.enabled | `boolean` | true | Enable or disable the event listeners |
| options.onChange | `(event: KeyboardEvent) => void` | - | The callback function to execute when hotkey is pressed |

#### Returns

`void`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | window | The target element to attach the event listener to |
| hotkeys | `string` | - | The hotkey to listen for |
| callback | `(event: KeyboardEvent) => void` | - | The callback function to execute when hotkey is pressed |
| options.enabled | `boolean` | true | Enable or disable the event listeners |

#### Returns

`void`

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| hotkeys | `string` | - | The hotkey to listen for |
| options | `UseHotkeysOptions` | - | The options for the hook |
| options.enabled | `boolean` | true | Enable or disable the event listeners |
| options.onChange | `(event: KeyboardEvent) => void` | - | The callback function to execute when hotkey is pressed |

#### Returns

`StateRef<Target>` - A reference to the target element

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| hotkeys | `string` | - | The hotkey to listen for |
| callback | `(event: KeyboardEvent) => void` | - | The callback function to execute when hotkey is pressed |
| options.enabled | `boolean` | true | Enable or disable the event listeners |

#### Returns

`StateRef<Target>` - A reference to the target element