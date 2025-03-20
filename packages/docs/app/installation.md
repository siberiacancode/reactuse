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

<div class="flex flex-col gap-4 md:flex-row">
  <a href="./installation/vite" class="w-full !no-underline">
    <Framework framework="vite" />
  </a>
  <a href="./installation/nextjs" class="w-full !no-underline">
    <Framework framework="next" />
  </a>
</div>
