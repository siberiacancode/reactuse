> [!NOTE]
> We prefer English language for all communication.

# Contributing to reactuse

Thanks for your interest in contributing to **reactuse**! This document explains how to report issues, set up the project locally, and submit a Pull Request.

## Creating an issue

Before creating an issue, please make sure the problem is not [already reported](https://github.com/siberiacancode/reactuse/issues).

- **Bug report** — provide a minimal reproduction using [StackBlitz](https://stackblitz.com) or [CodeSandbox](https://codesandbox.io), describe expected vs actual behavior, and include your environment (React version, browser, OS).
- **Feature request** — add a motivation section and a few usage examples showing how the hook or API would be used.

## Sending a Pull Request

1. fork and clone the repository
2. create a development branch from `main`
3. install dependencies from the root of the repo (Node `24.x` and `pnpm@11` are recommended):

```bash
   pnpm install
```

> Note: this is a pnpm workspace (monorepo). The command installs dependencies for all packages under `packages/*`.

4. build the package you are editing using its workspace filter from the root of the repo:

```bash
   pnpm --filter <PACKAGE_NAME> run build
```

Replace `<PACKAGE_NAME>` with the relevant package name. The main packages are:

- `@siberiacancode/reactuse` — the core hook library (`packages/hooks`)
- `@siberiacancode/docs` — the documentation site (`packages/docs`)
- `@siberiacancode/cli` / `useverse` — the CLI for adding hooks (`packages/cli`)

There are also handy shortcuts in the root `package.json`:

```bash
   pnpm core:build:js   # build the core library
   pnpm docs:build      # build the documentation site
   pnpm cli:build       # build the CLI and generate its registry
```

5. [make changes](#coding-guide), then run the checks locally:

```bash
   pnpm lint            # lint all packages
   pnpm unit-test       # run unit tests across all packages
   pnpm format          # format with prettier
```

6. [commit your changes](#commit-messages) (a `husky` + `lint-staged` pre-commit hook will lint and format staged files automatically)
7. push your feature branch and open a [Pull Request](https://github.com/siberiacancode/reactuse/compare) targeting `main`
8. link your PR to the issue using a [closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) or describe the motivation and changes in the comment (example: `fix #74`)
9. wait until a maintainer reviews it

## Creating a new hook

The goal of reactuse is to provide a large set of production-ready, TypeScript-first, SSR-compatible React hooks. Adding a new hook follows the same flow as [Sending a Pull Request](#sending-a-pull-request), plus a few conventions:

- each hook lives in its own directory inside the hooks package, named exactly after the hook (e.g. `useCounter/`)
- a hook directory should contain:
  - the hook implementation (`useCounter.ts`)
  - tests (`useCounter.test.ts`)
  - a demo/example component used by the docs
- export the new hook from the package entry point so it ships with the library and is picked up by the CLI registry
- make sure the hook is tree-shakeable and works in SSR (no direct access to `window`/`document` at module load — guard browser APIs inside effects)

After adding a dependency, run `pnpm install` from the repo root. To add a dependency to a specific package, use:

```bash
pnpm --filter <PACKAGE_NAME> add <LIBRARY>
```

If you're building an adapter around a particular library, add it as a peer dependency:

```bash
pnpm --filter <PACKAGE_NAME> add --save-peer <LIBRARY>
```
