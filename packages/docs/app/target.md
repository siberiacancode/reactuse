# Working with DOM elements

## Common library limitations

Many `React` libraries that work with DOM elements typically support only one way of providing target elements - usually through refs.

```typescript twoslash
import { useRef } from 'react';
import { useClickOutside } from '@siberiacancode/reactuse';

const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, () => console.log('Clicked outside'));
```

This limitation forces developers to always create refs by themselves, even in cases where they might have not want to create additional refs or want to use different selection methods, like `querySelector`.

## Flexible target handling with typescript overloads

Our library implements a flexible approach using `typescript` function overloads that allows hooks to work with targets in two different ways:

1. By passing an **existing** target _(ref, DOM element, function that returns a DOM element, or selector)_

```typescript twoslash
import { useRef } from 'react';
import { useClickOutside } from '@siberiacancode/reactuse';

const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, () => console.log('Clicked outside'));
```

or you can use [target](#the-target-function) function

```typescript twoslash
import { useClickOutside, target } from '@siberiacancode/reactuse';

useClickOutside(target('#container'), () => console.log('Clicked outside'));
```

2. By receiving a ref callback that can be attached to an element

```typescript twoslash
import { useClickOutside } from '@siberiacancode/reactuse';

const ref = useClickOutside<HTMLDivElement>(() => console.log('Clicked outside'));
```

This dual approach provides better developer experience and more flexibility in different use cases.

## The target function

The `target` is a utility function that helps you work with DOM elements in a flexible way. It allows you to reference DOM elements using different approaches:

- React refs _(RefObject)_
- Direct DOM elements _(Element | Window | Document)_
- Functions that return a DOM element _(() => Element | Window | Document)_
- Query selectors _(string)_

The flexibility of `target` means you can use our hooks like you want.

```typescript twoslash
import { useClickOutside, target } from '@siberiacancode/reactuse';

useClickOutside(target('#container'), () => console.log('Clicked outside'));

// or

useClickOutside(target(document.getElementById('container')!), () => console.log('Clicked outside'));
```
