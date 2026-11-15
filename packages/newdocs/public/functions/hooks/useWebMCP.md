---
title: useWebMCP
description: Registers a WebMCP tool for the component lifecycle
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1794732751297
---

# useWebMCP

Registers a WebMCP tool for the component lifecycle

## Demo

```tsx
import { useWebMCP } from '@siberiacancode/reactuse';
import { BotIcon } from 'lucide-react';

const Demo = () => {
  const webMCP = useWebMCP({
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
        .filter((name) => !!name!.startsWith('use'));

      const uniqueHooks = [...new Set(hooks)].sort();

      return {
        count: uniqueHooks.length,
        hooks: uniqueHooks
      };
    }
  });

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
npx useverse@latest add useWebMCP
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** Options passed to a WebMCP tool when it is executed */
export interface WebMCPToolExecuteOptions {
  signal: AbortSignal;
}

/** The WebMCP tool execute callback type */
export type WebMCPToolExecuteCallback = (
  input: Record<string, unknown>,
  options: WebMCPToolExecuteOptions
) => unknown | Promise<unknown>;

/** Metadata describing a WebMCP tool behavior */
export interface WebMCPToolAnnotations {
  consequentialHint?: boolean;
  debugging?: boolean;
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
}

/** A WebMCP tool definition */
export interface WebMCPModelContextTool {
  annotations?: WebMCPToolAnnotations;
  description: string;
  execute: WebMCPToolExecuteCallback;
  inputSchema?: object;
  name: string;
  title?: string;
}

/** Options for registering a WebMCP tool */
export interface WebMCPModelContextRegisterToolOptions {
  exposedTo?: string[];
  signal?: AbortSignal;
}

/** The browser WebMCP model context */
export interface WebMCPModelContext {
  registerTool: (
    tool: WebMCPModelContextTool,
    options?: WebMCPModelContextRegisterToolOptions
  ) => Promise<void>;
}

declare global {
  interface Document {
    readonly modelContext?: WebMCPModelContext;
  }
}

/** The use WebMCP common options type */
export type UseWebMCPCommonOptions = Omit<WebMCPModelContextRegisterToolOptions, 'signal'> & {
  /** Whether the tool should be registered immediately */
  immediately?: boolean;
};

/** The use WebMCP options type */
export type UseWebMCPOptions = WebMCPModelContextTool & UseWebMCPCommonOptions;

/** The use WebMCP return type */
export interface UseWebMCPReturn {
  /** Registration error */
  error?: Error;
  /** Whether the tool is currently registered */
  registered: boolean;
  /** Whether the WebMCP API is supported */
  supported: boolean;
  /** Register the tool again with the latest options */
  register: () => Promise<void>;
  /** Unregister the tool */
  unregister: () => void;
}

/**
 * @name useWebMCP
 * @description - Registers a WebMCP tool for the component lifecycle
 * @category Browser
 * @usage low
 *
 * @browserapi WebMCP https://github.com/webmachinelearning/webmcp
 *
 * @param {UseWebMCPOptions} options The tool definition and registration options
 * @param {string} options.name The tool name
 * @param {string} [options.title] The human-readable tool title
 * @param {string} options.description The tool description
 * @param {object} [options.inputSchema] The JSON schema describing the tool input
 * @param {Function} options.execute The function to execute when the tool is called
 * @param {object} [options.annotations] The metadata describing the tool behavior
 * @param {boolean} [options.immediately=true] Whether the tool should be registered immediately
 * @param {string[]} [options.exposedTo] The origins allowed to call the tool
 * @returns {UseWebMCPReturn} The WebMCP support and registration state
 *
 * @example
 * const { supported, registered, error, register, unregister } = useWebMCP({ name: 'add-todo', description: 'Adds a todo item', inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] }, execute: ({ text }) => addTodo(text) });
 */
export const useWebMCP = (options: UseWebMCPOptions): UseWebMCPReturn => {
  const supported = typeof document !== 'undefined' && !!document.modelContext;
  const immediately = options.immediately ?? true;
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<Error>();

  const optionsRef = useRef(options);
  optionsRef.current = options;
  const abortControllerRef = useRef<AbortController>(undefined);

  const unregister = () => {
    setRegistered(false);
    abortControllerRef.current?.abort();
    abortControllerRef.current = undefined;
  };

  const register = async () => {
    unregister();
    setError(undefined);

    if (!supported) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const tool: WebMCPModelContextTool = {
      name: optionsRef.current.name,
      title: optionsRef.current.title,
      description: optionsRef.current.description,
      inputSchema: optionsRef.current.inputSchema,
      annotations: optionsRef.current.annotations,
      execute: (input, executeOptions) => optionsRef.current.execute(input, executeOptions)
    };

    try {
      await document.modelContext!.registerTool(tool, {
        signal: abortController.signal,
        exposedTo: optionsRef.current.exposedTo
      });
      setRegistered(true);
    } catch (value) {
      if (abortController.signal.aborted) return;

      abortControllerRef.current = undefined;
      setError(value as Error);
    }
  };

  useEffect(() => {
    if (immediately) register();
    return unregister;
  }, [supported, options.name]);

  return { supported, registered, error, register, unregister };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, registered, error, register, unregister } = useWebMCP({
  name: 'add-todo',
  description: 'Adds a todo item',
  inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
  execute: ({ text }) => addTodo(text)
});
```

## Type Declarations

```tsx
export interface WebMCPToolExecuteOptions {
  signal: AbortSignal;
}

export type WebMCPToolExecuteCallback = (
  input: Record<string, unknown>,
  options: WebMCPToolExecuteOptions
) => unknown | Promise<unknown>;

export interface WebMCPToolAnnotations {
  consequentialHint?: boolean;
  debugging?: boolean;
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
}

export interface WebMCPModelContextTool {
  annotations?: WebMCPToolAnnotations;
  description: string;
  execute: WebMCPToolExecuteCallback;
  inputSchema?: object;
  name: string;
  title?: string;
}

export interface WebMCPModelContextRegisterToolOptions {
  exposedTo?: string[];
  signal?: AbortSignal;
}

export interface WebMCPModelContext {
  registerTool: (
    tool: WebMCPModelContextTool,
    options?: WebMCPModelContextRegisterToolOptions
  ) => Promise<void>;
}

interface Document {
  readonly modelContext?: WebMCPModelContext;
}

export type UseWebMCPCommonOptions = Omit<WebMCPModelContextRegisterToolOptions, 'signal'> & {
  /** Whether the tool should be registered immediately */
  immediately?: boolean;
};

export type UseWebMCPOptions = WebMCPModelContextTool & UseWebMCPCommonOptions;

export interface UseWebMCPReturn {
  /** Registration error */
  error?: Error;
  /** Whether the tool is currently registered */
  registered: boolean;
  /** Whether the WebMCP API is supported */
  supported: boolean;
  /** Register the tool again with the latest options */
  register: () => Promise<void>;
  /** Unregister the tool */
  unregister: () => void;
}
```

## API

### Parameters

| Name                | Type               | Default | Note                                              |
| ------------------- | ------------------ | ------- | ------------------------------------------------- |
| options             | `UseWebMCPOptions` | -       | The tool definition and registration options      |
| options.name        | `string`           | -       | The tool name                                     |
| options.title       | `string`           | -       | The human-readable tool title                     |
| options.description | `string`           | -       | The tool description                              |
| options.inputSchema | `object`           | -       | The JSON schema describing the tool input         |
| options.execute     | `Function`         | -       | The function to execute when the tool is called   |
| options.annotations | `object`           | -       | The metadata describing the tool behavior         |
| options.immediately | `boolean`          | true    | Whether the tool should be registered immediately |
| options.exposedTo   | `string[]`         | -       | The origins allowed to call the tool              |

### Returns

`UseWebMCPReturn` - The WebMCP support and registration state
