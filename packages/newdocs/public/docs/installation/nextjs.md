---
title: Next.js
description: Install and configure reactuse for Next.js.
---

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@docs/ui/tabs';

## Create project

Create a new Next.js app or use an existing one:

```bash
npx create-next-app@latest my-app
```

## Edit tsconfig.json file

Add `baseUrl` and `paths` so the CLI and imports resolve correctly. Use `"./*"` if the app lives in the project root, or `"./src/*"` if you use a `src` directory:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Run the CLI

Run the `useverse` init command to set up your project:

```bash
npx useverse@latest init
```

This creates a [`reactuse.json`](../reactuse-json.md) config file in your project.

## Add hooks

Add hooks with the CLI:

```bash
npx useverse@latest add useBoolean
```

Then import and use the hook (e.g. in `app/page.tsx`). Use `'use client'` when the component uses hooks:

```tsx title="app/page.tsx" showLineNumbers
'use client';

import { useBoolean } from '@/shared/hooks';

const Home = () => {
  const [on, toggle] = useBoolean();

  return (
    <div>
      <button onClick={() => toggle()}>Click me</button>
      <p>{on.toString()}</p>
    </div>
  );
};

export default Home;
```
