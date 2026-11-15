import { useEffect, useRef, useState } from 'react';
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
export const useWebMCP = (options) => {
  const supported = typeof document !== 'undefined' && !!document.modelContext;
  const immediately = options.immediately ?? true;
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const abortControllerRef = useRef(undefined);
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
    const tool = {
      name: optionsRef.current.name,
      title: optionsRef.current.title,
      description: optionsRef.current.description,
      inputSchema: optionsRef.current.inputSchema,
      annotations: optionsRef.current.annotations,
      execute: (input, executeOptions) => optionsRef.current.execute(input, executeOptions)
    };
    try {
      await document.modelContext.registerTool(tool, {
        signal: abortController.signal,
        exposedTo: optionsRef.current.exposedTo
      });
      setRegistered(true);
    } catch (value) {
      if (abortController.signal.aborted) return;
      abortControllerRef.current = undefined;
      setError(value);
    }
  };
  useEffect(() => {
    if (immediately) register();
    return unregister;
  }, [supported, options.name]);
  return { supported, registered, error, register, unregister };
};
