---
title: Astro
description: Install and configure reactuse for Astro.
---

# Astro

Install and configure reactuse for Astro.

### Create project

Start by creating a new Astro project with React integration:

```bash
npx create-astro@latest astro-app --template with-tailwindcss --install --add react --git
```

### Edit tsconfig.json file

Add the following to your `tsconfig.json` to resolve paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
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

You can now start adding hooks to your project.

```bash
npx useverse@latest add useBoolean
```

The command above will add the `useBoolean` hook to your project. Use the hook in a React component with `client:load` or `client:visible` so it runs on the client.

Example Astro page:

```astro title="src/pages/index.astro" showLineNumbers
---
import { ToggleButton } from '@/components/ToggleButton';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro + reactuse</title>
  </head>
  <body>
    <div class="grid place-items-center h-screen content-center">
      <ToggleButton client:load />
    </div>
  </body>
</html>
```

React component using the hook:

```tsx title="src/components/ToggleButton.tsx" showLineNumbers
import { useBoolean } from '@/shared/hooks';

export const ToggleButton = () => {
  const [on, toggle] = useBoolean();

  return (
    <button type='button' onClick={() => toggle()}>
      {on ? 'On' : 'Off'}
    </button>
  );
};
```
