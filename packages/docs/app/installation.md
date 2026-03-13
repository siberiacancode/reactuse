<script setup>
import Framework from '../src/components/framework.vue'
</script>

# Installation

How to install dependencies and structure your app.

## Install package

::: code-group

```bash [npm]
npm install @siberiacancode/reactuse
```

```bash [yarn]
yarn add @siberiacancode/reactuse
```

```bash [pnpm]
pnpm add @siberiacancode/reactuse
```

```bash [bun]
bun add @siberiacancode/reactuse
```

:::

## Inject code to your framework

How to install dependencies and structure your app with [cli](./cli.md) and [useverse](https://www.npmjs.com/package/useverse).

<div class="grid md:grid-cols-2 gap-4 grid-cols-1">
  <a href="./installation/vite" class="!no-underline">
    <Framework framework="vite" />
  </a>
  <a href="./installation/nextjs" class="!no-underline">
    <Framework framework="next" />
  </a>
  <a href="./installation/astro" class="!no-underline">
    <Framework framework="astro" />
  </a>
  <a href="./installation/react-router" class="!no-underline">
    <Framework framework="react-router" />
  </a>
  <a href="./installation/tanstack-router" class="!no-underline">
    <Framework framework="tanstack-router" />
  </a>
  <a href="./installation/tanstack" class="!no-underline">
    <Framework framework="tanstack" />
  </a>
  <a href="./installation/manual" class="!no-underline">
    <Framework framework="manual" />
  </a>
</div>
