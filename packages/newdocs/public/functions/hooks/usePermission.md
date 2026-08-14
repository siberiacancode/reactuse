---
title: usePermission
description: Hook that gives you the state of permission
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1783666924000
---

# usePermission

Hook that gives you the state of permission

## Demo

```tsx
import { usePermission } from '@siberiacancode/reactuse';
import { BellIcon, CheckIcon } from 'lucide-react';

const Demo = () => {
  const notifications = usePermission('notifications');

  const onSubscribe = async () => {
    await Notification.requestPermission();
  };

  return (
    <section className='flex w-full justify-center p-4'>
      <div className='border-border bg-card flex w-full max-w-xs flex-col items-center gap-8 rounded-t-3xl border border-b-0 px-6 pt-8 pb-7 shadow-lg'>
        <div className='flex flex-col items-center gap-5'>
          <div className='bg-muted-foreground/20 h-1 w-10 rounded-full' />

          <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full'>
            <BellIcon className='size-7' />
          </div>

          <div className='flex flex-col items-center gap-1.5 text-center'>
            <h3 className='text-xl!'>Stay in the loop</h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Subscribe to get notified about new hooks, releases, and everything happening with{' '}
              <span className='text-foreground font-medium'>reactuse</span>.
            </p>
          </div>
        </div>

        {notifications.state === 'granted' && (
          <div className='border-border text-foreground flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-medium'>
            <CheckIcon className='text-primary size-4' />
            You're subscribed
          </div>
        )}

        {notifications.state !== 'denied' && notifications.state !== 'granted' && (
          <button className='w-full rounded-full!' type='button' onClick={onSubscribe}>
            Subscribe
          </button>
        )}

        {notifications.state === 'denied' && (
          <p className='text-muted-foreground text-center text-xs leading-relaxed'>
            Notifications are turned off. You can enable them again from your browser settings.
          </p>
        )}
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
npx useverse@latest add usePermission
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The permission name */
export type UsePermissionName =
  | 'accelerometer'
  | 'accessibility-events'
  | 'ambient-light-sensor'
  | 'background-sync'
  | 'camera'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'gyroscope'
  | 'local-fonts'
  | 'magnetometer'
  | 'microphone'
  | 'notifications'
  | 'payment-handler'
  | 'persistent-storage'
  | 'push'
  | 'speaker'
  | PermissionName;

/** The use permission callback type */
export type UsePermissionCallback = (state: PermissionState) => void;

/** The use permission options type */
export interface UsePermissionOptions {
  /** The callback fired when the permission state changes */
  onChange?: UsePermissionCallback;
}

/** The use permission return type */
export interface UsePermissionReturn {
  /** The permission state */
  state: PermissionState;
  /** The permission supported status */
  supported: boolean;
  /** The permission query function */
  query: () => Promise<PermissionState>;
}

export interface UsePermission {
  (name: UsePermissionName, callback?: UsePermissionCallback): UsePermissionReturn;

  (name: UsePermissionName, options?: UsePermissionOptions): UsePermissionReturn;
}

/**
 *  @name usePermission
 *  @description - Hook that gives you the state of permission
 *  @category Browser
 *  @usage medium
 *
 *  @browserapi navigator.permissions https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
 *
 *  @overload
 *  @param {UsePermissionName} name The permission name
 *  @param {(state: PermissionState) => void} [callback] The callback fired when the permission state changes
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone', (state) => console.log(state));
 *
 *  @overload
 *  @param {UsePermissionName} name The permission name
 *  @param {(state: PermissionState) => void} [options.onChange] The callback fired when the permission state changes
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone');
 */
export const usePermission = ((...params: any[]) => {
  const name = params[0] as UsePermissionName;

  const options = (typeof params[1] === 'function' ? { onChange: params[1] } : params[1]) as
    | UsePermissionOptions
    | undefined;

  const supported =
    typeof navigator !== 'undefined' && 'permissions' in navigator && !!navigator.permissions;

  const [state, setState] = useState<PermissionState>('prompt');

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const query = async () => {
    if (!supported) return 'prompt' as const;

    try {
      const status = await navigator.permissions.query({ name } as PermissionDescriptor);

      setState(status.state);
      return status.state;
    } catch {
      setState('prompt');
      return 'prompt' as const;
    }
  };

  useEffect(() => {
    if (!supported) return;

    let status: PermissionStatus | undefined;

    const onChange = () => {
      setState(status!.state);
      optionsRef.current?.onChange?.(status!.state);
    };

    const subscribe = async () => {
      try {
        status = await navigator.permissions.query({ name } as PermissionDescriptor);

        setState(status.state);
        status.addEventListener('change', onChange);
      } catch {
        setState('prompt');
      }
    };

    subscribe();

    return () => {
      if (!status) return;
      status.removeEventListener('change', onChange);
    };
  }, [name]);

  return {
    state,
    supported,
    query
  };
}) as UsePermission;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { state, supported, query } = usePermission('microphone', (state) => console.log(state));
// or
const { state, supported, query } = usePermission('microphone');
```

## Type Declarations

```tsx
export type UsePermissionName =
  | 'accelerometer'
  | 'accessibility-events'
  | 'ambient-light-sensor'
  | 'background-sync'
  | 'camera'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'gyroscope'
  | 'local-fonts'
  | 'magnetometer'
  | 'microphone'
  | 'notifications'
  | 'payment-handler'
  | 'persistent-storage'
  | 'push'
  | 'speaker'
  | PermissionName;

export type UsePermissionCallback = (state: PermissionState) => void;

export interface UsePermissionOptions {
  /** The callback fired when the permission state changes */
  onChange?: UsePermissionCallback;
}

export interface UsePermissionReturn {
  /** The permission state */
  state: PermissionState;
  /** The permission supported status */
  supported: boolean;
  /** The permission query function */
  query: () => Promise<PermissionState>;
}

export interface UsePermission {
  (name: UsePermissionName, callback?: UsePermissionCallback): UsePermissionReturn;

  (name: UsePermissionName, options?: UsePermissionOptions): UsePermissionReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| name | `UsePermissionName` | - | The permission name |
| callback | `(state: PermissionState) => void` | - | The callback fired when the permission state changes |

#### Returns

`UsePermissionReturn` - An object containing the state and the supported status

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| name | `UsePermissionName` | - | The permission name |
| options.onChange | `(state: PermissionState) => void` | - | The callback fired when the permission state changes |

#### Returns

`UsePermissionReturn` - An object containing the state and the supported status