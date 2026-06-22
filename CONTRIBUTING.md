> [!NOTE]
> We prefer English language for all communication.

# Contributing to reactuse

Thanks for your interest in contributing to **reactuse**. This document explains how to report issues, set up the project locally, and submit a pull request.

## Creating an issue

Before creating an issue, please make sure the problem is not [already reported](https://github.com/siberiacancode/reactuse/issues).

- **Bug report** - provide a minimal reproduction using [StackBlitz](https://stackblitz.com) or [CodeSandbox](https://codesandbox.io), describe expected vs actual behavior, and include your environment (React version, browser, OS).
- **Feature request** - add a motivation section and a few usage examples showing how the hook or API would be used.

## Sending a Pull Request

1. fork and clone the repository
2. create a development branch from `main`
3. install the required tooling:

- `Node.js 24.x`
- `pnpm 11`
- `bun` for docs and codegen scripts in `packages/newdocs`

4. install dependencies from the root of the repo:

```bash
pnpm install
```

> Note: this is a pnpm workspace (monorepo). The command installs dependencies for all packages under `packages/*`.

5. build the package you are editing from the root of the repo:

```bash
pnpm --dir <PACKAGE_PATH> run build
```

Replace `<PACKAGE_PATH>` with the relevant package path. The main packages are:

- `packages/core` - the core hook library
- `packages/newdocs` - the documentation site
- `packages/cli` - the CLI for adding hooks

There are also handy shortcuts in the root `package.json`:

```bash
pnpm core:build:js   # build the core library
pnpm docs:build      # build the documentation site
pnpm cli:build       # build the CLI and generate its registry
```

6. make changes, then run the checks locally:

```bash
pnpm lint            # lint all packages
pnpm unit-test       # run unit tests across all packages
pnpm format          # format with prettier
```

7. commit your changes (a `husky` + `lint-staged` pre-commit hook will lint and format staged files automatically)
8. push your feature branch and open a [Pull Request](https://github.com/siberiacancode/reactuse/compare) targeting `main`
9. link your PR to the issue using a [closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) or describe the motivation and changes in the comment (example: `fix #74`)
10. wait until a maintainer reviews it

## Creating a new hook

The goal of reactuse is to provide a large set of production-ready, TypeScript-first, SSR-compatible React hooks. Adding a new hook follows the same flow as sending a pull request, plus a few conventions:

- each hook lives in its own directory inside the core package, named exactly after the hook (for example `useCounter/`)
- a hook directory should contain:
  - the hook implementation (`useCounter.ts`)
  - tests (`useCounter.test.ts`)
  - a demo or example component used by the docs
- export the new hook from the package entry point so it ships with the library and is picked up by the CLI registry
- make sure the hook is tree-shakeable and works in SSR (no direct access to `window` or `document` at module load; guard browser APIs inside effects)

After adding a dependency, run `pnpm install` from the repo root. To add a dependency to a specific package, use:

```bash
pnpm --dir <PACKAGE_PATH> add <LIBRARY>
```

If you're building an adapter around a particular library, add it as a peer dependency:

```bash
pnpm --dir <PACKAGE_PATH> add --save-peer <LIBRARY>
```
