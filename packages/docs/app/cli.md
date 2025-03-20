# CLI

Use the CLI to add hooks to your project with [useverse](https://www.npmjs.com/package/useverse).

## init

Use the `init` command to initialize configuration and dependencies for a new project.

The `init` command installs dependencies, adds configures [`reactuse.json`](./reactuse-json.md).

```bash
npx useverse@latest init
```

## add

Use the `add` command to add hooks and dependencies to your project.

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

### Options

```bash
Usage: useverse add [options] [hooks...]

add a hook to your project

Arguments:
  components the components to add or a url to the component.

Options:
  -o, --overwrite    overwrite existing files. (default: false)
  -c, --cwd          the working directory. defaults to the current directory.
  -a, --all          add all available hooks. (default: false)
  -h, --help         display help for command
```
