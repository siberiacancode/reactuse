---
title: Vite
description: Install and configure reactuse for Vite.
---

## Create project

Start by creating a new React project using `vite`. Select the **React + TypeScript** template:

```bash [npm]
npm create vite@latest
```

## Edit tsconfig.json file

The current version of Vite splits TypeScript configuration into three files, two of which need to be edited.
Add the `baseUrl` and `paths` properties to the `compilerOptions` section of the `tsconfig.json` and
`tsconfig.app.json` files:

```json {11-16} showLineNumbers
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
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Edit tsconfig.app.json file

Add the following code to the `tsconfig.app.json` file to resolve paths, for your IDE:

```json {4-9} showLineNumbers
{
  "compilerOptions": {
    // ...

    "paths": {
      "@/*": ["./src/*"]
    }
    // ...
  }
}
```

## Update vite.config.ts

Add the following code to the vite.config.ts so your app can resolve paths without error:

```bash [npm]
npm install -D @types/node
```

```typescript title="vite.config.ts" showLineNumbers {1,2,8-13}
import path from 'node:path';
import react from '@vitejs/plugin-react';
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

## Run the CLI

Run the `useverse` init command to set up your project:

```bash
npx useverse@latest init
```

This creates a [`reactuse.json`](../reactuse-json.md) config file in your project.

## Add hooks

Add hooks with the CLI.

```bash
npx useverse@latest add useBoolean
```

Then import and use the hook in your app:

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
};

export default App;
```
