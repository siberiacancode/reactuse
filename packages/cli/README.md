# useverse

A CLI for adding react hooks to your project.

## Usage

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.js`, and CSS variables for the project.

```bash
npx useverse init
```

## add

Use the `add` command to add components to your project.

The `add` command adds a hook to your project and installs all required dependencies.

```bash
npx useverse add [hook]
```

### Example

```bash
npx useverse add useCounter
```

You can also run the command without any arguments to view a list of all available hooks:

```bash
npx useverse add
```
