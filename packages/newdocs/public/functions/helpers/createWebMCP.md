---
title: createWebMCP
description: Creates a registry for WebMCP tools exposed by the current document
category: helpers
usage: low
type: helper
isTest: true
isDemo: true
lastModifiedTime: 1794732751021
---

# createWebMCP

Creates a registry for WebMCP tools exposed by the current document

## Demo

```tsx
import { createWebMCP } from '@siberiacancode/reactuse';
import { BotIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const Demo = () => {
  const [webMCP] = useState(createWebMCP);

  useEffect(() => {
    if (!webMCP.supported) return;

    void webMCP.register({
      name: 'get-react-hooks',
      title: 'Get React hooks',
      description: 'Returns all React hooks available in the reactuse documentation',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => {
        const hooks = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href*="/functions/hooks/"]')
        )
          .map((link) => link.href.split('/').filter(Boolean).at(-1))
          .filter((name): name is string => !!name?.startsWith('use'));

        const uniqueHooks = [...new Set(hooks)].sort();

        return {
          count: uniqueHooks.length,
          hooks: uniqueHooks
        };
      }
    });

    return webMCP.clear;
  }, []);

  if (!webMCP.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a href='https://developer.chrome.com/docs/ai/webmcp' rel='noreferrer' target='_blank'>
          API
        </a>
      </p>
    );
  }

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-4 p-4 text-center'>
      <div className='bg-muted flex size-14 items-center justify-center rounded-full'>
        <BotIcon className='size-7' />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-xl!'>React hooks for your agent</h3>
        <p className='text-muted-foreground text-sm'>Get the complete list of reactuse hooks.</p>
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add createWebMCP
```

### Manual

Copy and paste the following code into your project.

```tsx
import type {
  WebMCPModelContextRegisterToolOptions,
  WebMCPModelContextTool
} from '../../hooks/useWebMCP/useWebMCP';

export interface RegisterWebMCPTool {
  (tool: WebMCPModelContextTool, options?: WebMCPModelContextRegisterToolOptions): Promise<boolean>;
}

export interface createWebMCPReturn {
  register: RegisterWebMCPTool;
  readonly supported: boolean;
  clear: () => void;
  unregister: (name: string) => void;
}

/**
 * @name createWebMCP
 * @description - Creates a registry for WebMCP tools exposed by the current document
 * @category Helpers
 * @usage low
 *
 * @returns {createWebMCPReturn} - Object containing methods for managing WebMCP tools
 *
 * @example
 * const webMCP = createWebMCP();
 *
 * await webMCP.register({
 *   name: 'get-theme',
 *   description: 'Returns the current color theme',
 *   inputSchema: { type: 'object', properties: {} },
 *   execute: () => ({ theme: 'dark' })
 * });
 */
export const createWebMCP = (): createWebMCPReturn => {
  const supported = typeof document !== 'undefined' && !!document.modelContext;
  const registrations = new Map<string, AbortController>();

  const unregister = (name: string) => {
    const controller = registrations.get(name);
    if (!controller) return;

    controller.abort();
    registrations.delete(name);
  };

  const register = async (
    tool: WebMCPModelContextTool,
    options?: WebMCPModelContextRegisterToolOptions
  ) => {
    if (!supported) return false;

    unregister(tool.name);

    const controller = new AbortController();
    registrations.set(tool.name, controller);

    try {
      await document.modelContext!.registerTool(tool, {
        ...options,
        signal: controller.signal
      });
      return registrations.get(tool.name) === controller;
    } catch (error) {
      if (registrations.get(tool.name) === controller) {
        registrations.delete(tool.name);
      }
      controller.abort();
      throw error;
    }
  };

  const clear = () => {
    registrations.forEach((controller) => controller.abort());
    registrations.clear();
  };

  return {
    supported,
    register,
    unregister,
    clear
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const webMCP = createWebMCP();

await webMCP.register({
  name: 'get-theme',
  description: 'Returns the current color theme',
  inputSchema: { type: 'object', properties: {} },
  execute: () => ({ theme: 'dark' })
});
```

## Type Declarations

```tsx
import type {
  WebMCPModelContextRegisterToolOptions,
  WebMCPModelContextTool
} from '../../hooks/useWebMCP/useWebMCP';

export interface RegisterWebMCPTool {
  (tool: WebMCPModelContextTool, options?: WebMCPModelContextRegisterToolOptions): Promise<boolean>;
}

export interface createWebMCPReturn {
  register: RegisterWebMCPTool;
  readonly supported: boolean;
  clear: () => void;
  unregister: (name: string) => void;
}
```

## API

### Returns

`createWebMCPReturn` - Object containing methods for managing WebMCP tools
