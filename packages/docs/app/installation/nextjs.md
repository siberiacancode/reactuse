---
title: Next.js
description: Install and configure reactuse for Next.js.
---

# Next.js

Install and configure reactuse for Next.js.

```bash
npx create-next-app@latest
```

### Edit tsconfig.json file

Make sure your `tsconfig.json` includes the following paths configuration:

```json
{
  "compilerOptions": {
    //...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
    //...
  }
}
```

### Run the CLI

Run the `useverse` init command to setup your project:

```bash
npx useverse@latest init
```

This will create a configuration file [`reactuse.json`](../reactuse-json.md) in your project.

### Add hooks

You can now start adding hooks to your project:

```bash
npx useverse@latest add useBoolean
```

The command above will add the `useBoolean` hook to your project. You can then import it like this:

```tsx
'use client';

import { useBoolean } from '@/shared/hooks';

export default function Home() {
  const [on, toggle] = useBoolean();

  return (
    <div>
      <button onClick={() => toggle()}>Click me</button>
      <p>{on.toString()}</p>
    </div>
  );
}
```
