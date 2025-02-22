import { useRef } from 'react';
/**
 * @name useRenderInfo
 * @description - Hook for getting information about component rerender
 * @category Lifecycle
 *
 * @param {string} [name] Component name
 * @param {boolean} [log] Toggle logging
 * @returns {UseRenderInfoReturn} An object containing rerender information
 *
 * @example
 * const rerenderInfo = useRenderInfo('Component');
 */
export const useRenderInfo = (name = 'Unknown', log = true) => {
  const renderInfoRef = useRef({
    component: name,
    renders: 0,
    timestamp: Date.now(),
    sinceLast: 0
  });
  const now = Date.now();
  renderInfoRef.current.renders += 1;
  renderInfoRef.current.sinceLast = renderInfoRef.current.timestamp
    ? now - renderInfoRef.current.timestamp
    : 0;
  renderInfoRef.current.timestamp = now;
  if (log) {
    console.group(`${name} info, render number: ${renderInfoRef.current.renders}`);
    console.log(`Timestamp: ${renderInfoRef.current.timestamp}`);
    console.log(`Since last render: ${renderInfoRef.current.sinceLast}`);
    console.log(`Renders: ${renderInfoRef.current.renders}`);
    console.dir(renderInfoRef.current);
    console.groupEnd();
  }
  return renderInfoRef.current;
};
