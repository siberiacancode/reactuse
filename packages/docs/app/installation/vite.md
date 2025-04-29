# Vite

Install and configure reactuse for Vite.

### Create project

Start by creating a new React project using `vite`. Select the **React + TypeScript** template:

::: code-group

```bash [npm]
npm create vite@latest
```

```bash [yarn]
yarn create vite@latest
```

```bash [pnpm]
pnpm create vite@latest
```

```bash [bun]
bun create vite@latest

```

:::

### Edit tsconfig.json file

The current version of Vite splits TypeScript configuration into three files, two of which need to be edited.
Add the `baseUrl` and `paths` properties to the `compilerOptions` section of the `tsconfig.json` and
`tsconfig.app.json` files:

```ts {11-16} showLineNumbers
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Edit tsconfig.app.json file

Add the following code to the `tsconfig.app.json` file to resolve paths, for your IDE:

```ts {4-9} showLineNumbers
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```

### Update vite.config.ts

Add the following code to the vite.config.ts so your app can resolve paths without error:

::: code-group

```bash [npm]
npm install -D @types/node
```

```bash [yarn]
yarn add -D @types/node
```

```bash [pnpm]
pnpm add -D @types/node
```

```bash [bun]
bun add -D @types/node

```

:::

```typescript title="vite.config.ts" showLineNumbers {1,2,8-13}
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Run the CLI

Run the `useverse` init command to setup your project:

```bash
npx useverse@latest init
```

This will create a configuration file [`reactuse.json`](../reactuse-json.md) in your project.

### Add hooks

You can now start adding hooks to your project.

```bash
npx useverse@latest add useBoolean
```

The command above will add the `useBoolean` hook to your project. You can then import it like this:

```tsx showLineNumbers title="src/App.tsx"
import { useBoolean } from '@/shared/hooks';

const App = () => {
  const [on, toggle] = useBoolean();

  return (
    <div>
      <button onClick={() => toggle()}>Click me</button>
      <p>{on.toString()}</p>
    </div>
  );
}

export default App;
```
