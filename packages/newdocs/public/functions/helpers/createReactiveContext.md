---
title: createReactiveContext
description: Creates a typed context selector with optimized updates for state selection
category: helpers
usage: low
type: helper
isTest: true
isDemo: true
lastModifiedTime: 1755150117000
---

# createReactiveContext

Creates a typed context selector with optimized updates for state selection

> Warning: For complex interfaces, we strongly recommend using state management solutions outside of React like createStore, reatom, effector, or zustand instead of context

## Demo

```tsx
import type { SubmitEvent } from 'react';

import { createReactiveContext, useDidUpdate, useEvent } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { memo, useRef, useState } from 'react';

interface Profile {
  bio: string;
  email: string;
  isPublic: boolean;
  language: string;
  name: string;
  notifications: boolean;
}

const DEFAULT_PROFILE: Profile = {
  name: 'siberiacancode',
  email: 'hello@reactuse.org',
  bio: 'Building open-source React hooks',
  language: 'en',
  notifications: true,
  isPublic: false
};

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'de', label: 'German' }
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

interface ProfileContext {
  profile: Profile;
  set: (profile: Partial<Profile>) => void;
}

const { Provider, useSelector } = createReactiveContext<ProfileContext>({
  profile: DEFAULT_PROFILE,
  set: () => {}
});

interface RerenderInfoProps {
  componentName: string;
}

const RerenderInfo = ({ componentName }: RerenderInfoProps) => {
  const countRef = useRef(0);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useDidUpdate(() => {
    countRef.current++;
    if (badgeRef.current) {
      badgeRef.current.textContent = `${componentName} x${countRef.current}`;
      badgeRef.current.style.opacity = '1';
    }

    const timer = setTimeout(() => {
      if (badgeRef.current) badgeRef.current.style.opacity = '0';
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <span
      ref={badgeRef}
      className='bg-primary text-primary-foreground absolute -top-2.5 right-0 z-10 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition-opacity duration-300'
      style={{ opacity: 0 }}
    />
  );
};

const NameField = memo(() => {
  const name = useSelector((state) => state.profile.name);
  const set = useSelector((state) => state.set);
  const error = name.trim().length < 2 ? 'At least 2 characters' : '';

  return (
    <div className='relative flex flex-col gap-1.5'>
      <RerenderInfo componentName='NameField' />
      <label className='text-foreground text-xs font-medium' htmlFor='name'>
        Display name
      </label>
      <input
        className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
        id='name'
        placeholder='Your name'
        value={name}
        onChange={(event) => set({ name: event.target.value })}
      />
      {error && <span className='text-destructive text-xs'>{error}</span>}
    </div>
  );
});
NameField.displayName = 'NameField';

const EmailField = memo(() => {
  const email = useSelector((state) => state.profile.email);
  const set = useSelector((state) => state.set);
  const error = !EMAIL_PATTERN.test(email) ? 'Invalid email format' : '';

  return (
    <div className='relative flex flex-col gap-1.5'>
      <RerenderInfo componentName='EmailField' />
      <label className='text-foreground text-xs font-medium' htmlFor='email'>
        Email
      </label>
      <input
        className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
        id='email'
        placeholder='you@example.com'
        type='email'
        value={email}
        onChange={(event) => set({ email: event.target.value })}
      />
      {error && <span className='text-destructive text-xs'>{error}</span>}
    </div>
  );
});
EmailField.displayName = 'EmailField';

const BioField = memo(() => {
  const bio = useSelector((state) => state.profile.bio);
  const set = useSelector((state) => state.set);

  return (
    <div className='relative flex flex-col gap-1.5'>
      <RerenderInfo componentName='BioField' />
      <label className='text-foreground text-xs font-medium' htmlFor='bio'>
        Bio
      </label>
      <textarea
        className='border-border bg-card text-foreground min-h-[72px] resize-none rounded-md border px-3 py-2 text-sm outline-none'
        id='bio'
        placeholder='Tell something about yourself...'
        value={bio}
        onChange={(event) => set({ bio: event.target.value })}
      />
    </div>
  );
});
BioField.displayName = 'BioField';

const NotificationsField = memo(() => {
  const notifications = useSelector((state) => state.profile.notifications);
  const set = useSelector((state) => state.set);

  return (
    <label className='relative flex cursor-pointer items-start justify-between gap-3'>
      <RerenderInfo componentName='NotificationsField' />
      <div className='flex flex-col gap-0.5'>
        <span className='text-foreground text-xs font-medium'>Email notifications</span>
        <span className='text-muted-foreground text-[11px]'>
          Receive product updates and release notes
        </span>
      </div>
      <input
        checked={notifications}
        role='switch'
        type='checkbox'
        onChange={(event) => set({ notifications: event.target.checked })}
      />
    </label>
  );
});
NotificationsField.displayName = 'NotificationsField';

const LanguageField = memo(() => {
  const language = useSelector((state) => state.profile.language);
  const set = useSelector((state) => state.set);

  return (
    <div className='relative flex items-center justify-between gap-3'>
      <RerenderInfo componentName='LanguageField' />
      <div className='flex flex-col gap-0.5'>
        <label className='text-foreground text-xs font-medium' htmlFor='language'>
          Language
        </label>
        <span className='text-muted-foreground text-[11px]'>Choose your preferred language</span>
      </div>
      <div className='relative'>
        <select
          className='border-border bg-card text-foreground w-32 appearance-none rounded-md border py-1.5 pr-7 pl-3 text-xs outline-none'
          id='language'
          value={language}
          onChange={(event) => set({ language: event.target.value })}
        >
          {LANGUAGES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2' />
      </div>
    </div>
  );
});
LanguageField.displayName = 'LanguageField';

const PublicField = memo(() => {
  const isPublic = useSelector((state) => state.profile.isPublic);
  const set = useSelector((state) => state.set);

  return (
    <label className='relative flex cursor-pointer items-start gap-3'>
      <RerenderInfo componentName='PublicField' />
      <span className='mt-0.5 flex shrink-0 items-center'>
        <input
          checked={isPublic}
          className='peer sr-only'
          type='checkbox'
          onChange={(event) => set({ isPublic: event.target.checked })}
        />
        <span className='border-border peer-checked:border-foreground peer-checked:bg-foreground flex size-4 items-center justify-center rounded-[5px] border transition-colors'>
          {isPublic && <CheckIcon className='text-background size-3' strokeWidth={3.5} />}
        </span>
      </span>
      <div className='flex flex-col gap-0.5'>
        <span className='text-foreground text-xs font-medium'>Make profile public</span>
        <span className='text-muted-foreground text-[11px]'>
          Anyone on the internet can see your profile
        </span>
      </div>
    </label>
  );
});
PublicField.displayName = 'PublicField';

const Demo = () => {
  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Account settings</h2>
        <p className='text-muted-foreground text-xs'>
          Each field subscribes to its own slice - only the changed field re-renders.
        </p>
      </div>

      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <NameField />
        <EmailField />
        <BioField />
        <NotificationsField />
        <LanguageField />
        <PublicField />
      </form>
    </section>
  );
};

const App = () => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const set = useEvent((updated: Partial<Profile>) =>
    setProfile((prev) => ({ ...prev, ...updated }))
  );

  return (
    <Provider value={{ profile, set }}>
      <Demo />
    </Provider>
  );
};

export default App;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add createReactiveContext
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { Context, FC, Provider, ProviderProps, RefObject } from 'react';

import {
  createContext,
  createElement,
  startTransition,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';

import { useEvent, useIsomorphicLayoutEffect } from '@/hooks';

/** The create reactive context options type */
export interface CreateReactiveContextOptions {
  /** Display name for the context (useful for debugging) */
  name?: string;
  /** Whether to throw an error if context is used outside of Provider */
  strict?: boolean;
}

/** The create reactive context return type */
export interface CreateReactiveContextReturn<Value> {
  /** The context instance */
  instance: Context<ReactiveContextValue<Value>>;
  /** The Provider component for the context */
  Provider: Provider<Value>;
  /** A hook to select a part of the context state */
  useSelector: <Selected>(selector?: (state: Value) => Selected) => Selected;
}

type ContextListener<Value> = (value: Value) => void;

interface ReactiveContextValue<Value> {
  /** The listeners for the context */
  listeners: Set<ContextListener<Value>>;
  /** The value for the context */
  value: RefObject<Value>;
}

const createProvider = <Value>(originalProvider: Provider<ReactiveContextValue<Value>>) => {
  const Provider: FC<ProviderProps<Value>> = (props) => {
    const valueRef = useRef(props.value);
    const contextValue = useMemo<ReactiveContextValue<Value>>(
      () => ({
        value: valueRef,
        listeners: new Set()
      }),
      []
    );

    useIsomorphicLayoutEffect(() => {
      if (!Object.is(valueRef.current, props.value)) {
        valueRef.current = props.value;

        startTransition(() => {
          contextValue.listeners.forEach((listener) => {
            listener(valueRef.current);
          });
        });
      }
    }, [props.value]);

    return createElement(originalProvider, { value: contextValue }, props.children);
  };

  return Provider as unknown as Provider<ReactiveContextValue<Value>>;
};

const createReactiveContextSelector = <Value, Selected>(
  Context: Context<ReactiveContextValue<Value>>,
  selector: (state: Value) => Selected,
  options: CreateReactiveContextOptions = {}
) => {
  const context = useContext(Context);

  if (!context && options.strict) {
    throw new Error(`Context hook ${options.name} must be used inside a Provider`);
  }

  const [value, setValue] = useState({
    selected: selector(context.value.current),
    value: context.value.current
  });

  const dispatch = useEvent((newValue: Value) => {
    setValue((prevValue) => {
      if (Object.is(prevValue.value, newValue)) return prevValue;

      const newSelected = selector(newValue);
      if (Object.is(prevValue.selected, newSelected)) return prevValue;

      return { value: newValue, selected: newSelected };
    });
  });

  useIsomorphicLayoutEffect(() => {
    context.listeners.add(dispatch);
    return () => {
      context.listeners.delete(dispatch);
    };
  }, [context.listeners]);

  return value.selected;
};

/**
 * @name createReactiveContext
 * @description - Creates a typed context selector with optimized updates for state selection
 * @category Helpers
 * @usage low
 *
 * @warning - For complex interfaces, we strongly recommend using state management solutions outside of React like createStore, reatom, effector, or zustand instead of context
 *
 * @template Value - The type of value that will be stored in the context
 * @param {Value | undefined} [defaultValue] - Default value for the context
 * @param {CreateReactiveContextOptions<Value>} [options] - Additional options for context creation
 * @returns {CreateReactiveContextReturn<Value>} Object containing context utilities and components
 *
 * @example
 * const { Provider, useSelector, instance } = createReactiveContext<number>(0);
 */
export const createReactiveContext = <Value extends Record<string, any>>(
  defaultValue: Value | undefined = undefined,
  options: CreateReactiveContextOptions = {}
) => {
  const Context = createContext<ReactiveContextValue<Value>>({
    value: { current: defaultValue as Value },
    listeners: new Set()
  });

  const Provider = createProvider(Context.Provider) as unknown as Provider<Value>;

  Context.displayName = options.name;

  function useSelector(): Value;
  function useSelector<SelectedValue>(selector: (state: Value) => SelectedValue): SelectedValue;
  function useSelector<SelectedValue>(selector?: (state: Value) => SelectedValue) {
    return createReactiveContextSelector(
      Context as unknown as Context<ReactiveContextValue<Value>>,
      selector ?? ((state) => state as unknown as SelectedValue),
      options
    );
  }

  return { instance: Context, Provider, useSelector };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { Provider, useSelector, instance } = createReactiveContext<number>(0);
```

## Type Declarations

```tsx
import type { Context, FC, Provider, ProviderProps, RefObject } from 'react';

export interface CreateReactiveContextOptions {
  /** Display name for the context (useful for debugging) */
  name?: string;
  /** Whether to throw an error if context is used outside of Provider */
  strict?: boolean;
}

export interface CreateReactiveContextReturn<Value> {
  /** The context instance */
  instance: Context<ReactiveContextValue<Value>>;
  /** The Provider component for the context */
  Provider: Provider<Value>;
  /** A hook to select a part of the context state */
  useSelector: <Selected>(selector?: (state: Value) => Selected) => Selected;
}

type ContextListener<Value> = (value: Value) => void;

interface ReactiveContextValue<Value> {
  /** The listeners for the context */
  listeners: Set<ContextListener<Value>>;
  /** The value for the context */
  value: RefObject<Value>;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| defaultValue | `Value \| undefined` | - | Default value for the context |
| options | `CreateReactiveContextOptions<Value>` | - | Additional options for context creation |

### Returns

`CreateReactiveContextReturn<Value>` - Object containing context utilities and components