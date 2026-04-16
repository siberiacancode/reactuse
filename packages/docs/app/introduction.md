# Introduction

React Use delivers **production-ready hooks** that solve real-world problems. Built with **TypeScript-first** approach, **SSR compatibility**, and **tree-shaking optimization** - everything you need to build modern React applications. Improve your react applications with our library 📦 designed for comfort and speed.

## Getting Started

```bash
npm install @siberiacancode/reactuse
```

After installation, you can use any of our hooks in your components:

```tsx
import { useCounter } from '@siberiacancode/reactuse';

const App = () => {
  const counter = useCounter(0);

  return (
    <div>
      <h1>Count: {counter.value}</h1>
      <button onClick={() => counter.inc()}>+1</button>
      <button onClick={() => counter.dec()}>-1</button>
    </div>
  );
};
```

## CLI Installation

Use the CLI to add hooks to your project with [useverse](https://www.npmjs.com/package/useverse).

```bash
npx useverse@latest init
```

```bash
npx useverse@latest add [hook]
```

You will be presented with a list of hooks to choose from:

```bash
Which hooks would you like to add? › Space to select. A to toggle all.
Enter to submit.

◯  useActiveElement
◯  useAsync
◯  useBattery
◯  useBluetooth
◯  useBoolean
◯  useBreakpoints
◯  useBrowserLanguage
◯  useClickOutside
◯  useClipboard
◯  useConst
```
