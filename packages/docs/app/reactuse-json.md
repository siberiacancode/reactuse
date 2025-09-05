# reactuse.json

Configuration for your project.

The `reactuse.json` file holds configuration for your project.

We use it to understand how your project is set up and how to generate hooks customized for your project.

::: info
Note: The `reactuse.json` file is optional and **only required if you're
using the CLI** to add hooks to your project. If you're using the copy
and paste method, you don't need this file.
:::

You can create a `reactuse.json` file in your project by running the following command:

```bash
npx useverse@latest init
```

See the [CLI section](./cli.md) for more information.

## ts

Choose between TypeScript or JavaScript hooks.

Setting this option to `false` allows hooks to be added as JavaScript with the `.jsx` file extension.

```json title="reactuse.json"
{
  "ts": true | false
}
```

## aliases

The CLI uses these values and the `paths` config from your `tsconfig.json` or `jsconfig.json` file to place generated hooks in the correct location.

Path aliases have to be set up in your `tsconfig.json` or `jsconfig.json` file.

::: info
**Important:** If you're using the `src` directory, make sure it is included
under `paths` in your `tsconfig.json` or `jsconfig.json` file.
:::

### aliases.utils

Import alias for your utility functions.

```json title="reactuse.json"
{
  "aliases": {
    "utils": "@/utils/lib"
  }
}
```

### aliases.hooks

Import alias for your hooks.

```json title="reactuse.json"
{
  "aliases": {
    "hooks": "@/shared/hooks"
  }
}
```

## case

Controls the naming convention for generated files.

There are two options:

- `camel`: All files will be generated in `camelCase` (e.g., `useClickOutside.ts`).
- `kebab`: All files will be generated in `kebab-case` (e.g., `use-click-outside.ts`).

```json title="reactuse.json"
{
  "case": "camel" | "kebab"
}
```
