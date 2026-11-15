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
    unregister(tool.name);

    const controller = new AbortController();
    registrations.set(tool.name, controller);

    await document.modelContext!.registerTool(tool, {
      ...options,
      signal: controller.signal
    });
    return registrations.get(tool.name) === controller;
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
