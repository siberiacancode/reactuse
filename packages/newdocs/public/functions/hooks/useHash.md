---
title: useHash
description: Hook that manages the hash value
category: state
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1770651919000
---

# useHash

Hook that manages the hash value

## Demo

```tsx
import { useHash } from '@siberiacancode/reactuse';
import { MountainIcon, TreesIcon, TriangleIcon, WavesIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const HABITATS = [
  {
    id: 'forest',
    label: 'Forest',
    icon: TreesIcon,
    pokemon: [
      { id: 1, name: 'Bulbasaur' },
      { id: 25, name: 'Pikachu' },
      { id: 10, name: 'Caterpie' },
      { id: 16, name: 'Pidgey' }
    ]
  },
  {
    id: 'cave',
    label: 'Cave',
    icon: TriangleIcon,
    pokemon: [
      { id: 41, name: 'Zubat' },
      { id: 95, name: 'Onix' },
      { id: 74, name: 'Geodude' },
      { id: 50, name: 'Diglett' }
    ]
  },
  {
    id: 'mountain',
    label: 'Mountain',
    icon: MountainIcon,
    pokemon: [
      { id: 6, name: 'Charizard' },
      { id: 149, name: 'Dragonite' },
      { id: 142, name: 'Aerodactyl' },
      { id: 144, name: 'Articuno' }
    ]
  },
  {
    id: 'waterside',
    label: 'Waterside',
    icon: WavesIcon,
    pokemon: [
      { id: 7, name: 'Squirtle' },
      { id: 131, name: 'Lapras' },
      { id: 54, name: 'Psyduck' },
      { id: 120, name: 'Staryu' }
    ]
  }
] as const;

const Demo = () => {
  const hash = useHash('forest');

  const active = HABITATS.find((habitat) => habitat.id === hash.value) ?? HABITATS[0];

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='flex flex-col gap-1 px-1'>
        <h2 className='text-foreground text-sm font-semibold'>Pokémon habitats</h2>
        <p className='text-muted-foreground text-xs'>
          Explore where different Pokémon make their home.
        </p>
      </div>

      <div data-slot='tabs'>
        <div data-slot='tabs-list'>
          {HABITATS.map((habitat) => {
            const Icon = habitat.icon;
            return (
              <button
                key={habitat.id}
                data-state={cn(active.id === habitat.id && 'active')}
                data-variant='tabs-trigger'
                type='button'
                onClick={() => hash.set(habitat.id)}
              >
                <Icon className='size-3.5' />
                {habitat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
        {active.pokemon.map((pokemon) => (
          <div
            key={pokemon.id}
            className='bg-card flex items-center gap-2 rounded-lg p-2 shadow-sm'
          >
            <div className='bg-muted/40 flex size-12 shrink-0 items-center justify-center rounded-md'>
              <img
                alt={pokemon.name}
                className='size-10 object-contain'
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              />
            </div>
            <div className='flex min-w-0 flex-1 flex-col leading-tight'>
              <span className='text-foreground text-md truncate font-semibold md:text-xs'>
                {pokemon.name}
              </span>
              <span className='text-muted-foreground font-mono text-sm tabular-nums md:text-[10px]'>
                #{String(pokemon.id).padStart(3, '0')}
              </span>
            </div>
          </div>
        ))}
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
npx useverse@latest add useHash
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

export const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));

/** The use hash options type */
export interface UseHashOptions {
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The mode of hash setting */
  mode?: 'initial' | 'replace';
  /** Callback function called when hash changes */
  onChange?: (hash: string) => void;
}

/** The use hash return type */
interface UseHashReturn {
  /** The hash value */
  value: string;
  /** The function to set the hash value */
  set: (value: string) => void;
}

export interface UseHash {
  (initialValue?: string, options?: UseHashOptions): UseHashReturn;

  (options?: UseHashOptions): UseHashReturn;

  (initialValue?: string, callback?: (hash: string) => void): UseHashReturn;

  (callback?: (hash: string) => void): UseHashReturn;
}

/**
 * @name useHash
 * @description - Hook that manages the hash value
 * @category State
 * @usage low
 *
 * @overload
 * @param {string} [initialValue] The initial hash value if no hash exists
 * @param {UseHashOptions} [options] Configuration options
 * @param {boolean} [options.enabled] The enabled state of the hook
 * @param {'initial' | 'replace'} [options.mode] The mode of hash setting
 * @param {(hash: string) => void} [options.onChange] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash("initial");
 *
 * @overload
 * @param {string} [initialValue] The initial hash value if no hash exists
 * @param {(hash: string) => void} [callback] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash("initial", (newHash) => console.log('callback'));
 *
 * @overload
 * @param {UseHashOptions} [options] Configuration options
 * @param {boolean} [options.enabled] The enabled state of the hook
 * @param {'initial' | 'replace'} [options.mode] The mode of hash setting
 * @param {(hash: string) => void} [options.onChange] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash();
 *
 * @overload
 * @param {(hash: string) => void} [callback] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash((newHash) => console.log('callback'));
 */
export const useHash = ((...params: any[]) => {
  const initialValue = typeof params[0] === 'string' ? params[0] : '';
  const options =
    typeof params[1] === 'object'
      ? params[1]
      : typeof params[1] === 'function'
        ? { onChange: params[1] }
        : typeof params[0] === 'object'
          ? params[0]
          : {};

  const enabled = options?.enabled ?? true;
  const mode = options?.mode ?? 'replace';

  const [hash, setHash] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    return getHash() || initialValue;
  });

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const set = (value: string) => {
    window.location.hash = value;
    setHash(value);
    optionsRef.current?.onChange?.(value);
  };

  useEffect(() => {
    if (!enabled) return;

    if (mode === 'replace') window.location.hash = hash;

    const onHashChange = () => {
      const newHash = getHash();
      setHash(newHash);
      optionsRef.current?.onChange?.(newHash);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [enabled, mode]);

  return {
    value: hash,
    set
  };
}) as UseHash;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set } = useHash("initial");
// or
const { value, set } = useHash("initial", (newHash) => console.log('callback'));
// or
const { value, set } = useHash();
// or
const { value, set } = useHash((newHash) => console.log('callback'));
```

## Type Declarations

```tsx
export interface UseHashOptions {
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The mode of hash setting */
  mode?: 'initial' | 'replace';
  /** Callback function called when hash changes */
  onChange?: (hash: string) => void;
}

interface UseHashReturn {
  /** The hash value */
  value: string;
  /** The function to set the hash value */
  set: (value: string) => void;
}

export interface UseHash {
  (initialValue?: string, options?: UseHashOptions): UseHashReturn;

  (options?: UseHashOptions): UseHashReturn;

  (initialValue?: string, callback?: (hash: string) => void): UseHashReturn;

  (callback?: (hash: string) => void): UseHashReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `string` | - | The initial hash value if no hash exists |
| options | `UseHashOptions` | - | Configuration options |
| options.enabled | `boolean` | - | The enabled state of the hook |
| options.mode | `'initial' \| 'replace'` | - | The mode of hash setting |
| options.onChange | `(hash: string) => void` | - | Callback function called when hash changes |

#### Returns

`UseHashReturn` - An array containing the hash value and a function to set the hash value

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `string` | - | The initial hash value if no hash exists |
| callback | `(hash: string) => void` | - | Callback function called when hash changes |

#### Returns

`UseHashReturn` - An array containing the hash value and a function to set the hash value

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseHashOptions` | - | Configuration options |
| options.enabled | `boolean` | - | The enabled state of the hook |
| options.mode | `'initial' \| 'replace'` | - | The mode of hash setting |
| options.onChange | `(hash: string) => void` | - | Callback function called when hash changes |

#### Returns

`UseHashReturn` - An array containing the hash value and a function to set the hash value

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(hash: string) => void` | - | Callback function called when hash changes |

#### Returns

`UseHashReturn` - An array containing the hash value and a function to set the hash value