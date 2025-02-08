# 🚀 reactuse cli

### 📦 Prepare to develop

1. Install dependencies
   First, make sure you have installed the necessary dependencies:

```bash
yarn install
```

### 🔗 Link the CLI package

To test the CLI locally, you need to link it to your system. This allows you to use the command from anywhere without needing to install it globally.

```bash
yarn link
```

Link it in your test project Next, in the project where you want to test the CLI, run:

```bash
yarn link "@siberiacancode/reactuse-cli"
```

This will link the local version of your CLI to your test project.

### 🔥 Use the CLI in your project

Now that everything is set up, you can use the CLI to add hooks to your project. For example:

```bash
COMPONENTS_REGISTRY_URL=http://localhost:5173/reactuse/registry.json npx reactuse-cli add useTime
```

This command will add the useTime hook to your project. You can use this for any hook that's available in your registry.
