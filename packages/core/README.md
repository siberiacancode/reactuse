<div align="center">
  <a href="https://reactuse.dev">
    <picture>
      <img alt="React Use logo" src="https://siberiacancode.github.io/reactuse/logo.svg" height="128">
    </picture>
  </a>
  <h1>React Use</h1>

<a href="https://www.npmjs.com/package/@siberiacancode/reactuse"><img alt="NPM version" src="https://img.shields.io/npm/v/@reactuses/core.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/siberiacancode/reactuse/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@reactuses/core.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/siberiacancode/reactuse/discussions"><img alt="Join the community on GitHub" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=React&labelColor=000000&logoWidth=20"></a>

</div>

React Use delivers **production-ready hooks** that solve real-world problems. Built with **TypeScript-first** approach, **SSR compatibility**, and **tree-shaking optimization** - everything you need to build modern React applications. Improve your react applications with our library 📦 designed for comfort and speed.

## Documentation

Visit https://siberiacancode.github.io/reactuse to view the full documentation.

## Getting Started

```bash
npm install @siberiacancode/reactuse
```

```tsx
import { useCounter } from '@reactuses/core';

function App() {
  const counter = useCounter(0);

  return (
    <div>
      <h1>Count: {const.value}</h1>
      <button onClick={() => const.inc()}>+1</button>
      <button onClick={() => const.dec()}>-1</button>
    </div>
  );
}
```

## CLI installation

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
