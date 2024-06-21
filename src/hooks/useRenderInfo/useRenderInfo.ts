import { useRef } from 'react';

export interface UseRenderInfoReturn {
  component: string;
  renders: number;
  timestamp: null | number;
  sinceLast: number;
}

/**
 * @name useRenderInfo
 * @description - Hook for getting information about component rerender
 *
 * @param {string} [name='Unknown'] Component name
 * @param {boolean} [log=true] Toggle logging
 * @returns {UseRenderInfoReturn} An object containing rerender information
 *
 * @example
 * const rerenderInfo = useRenderInfo('Component');
 */
export const useRenderInfo = (name: string = 'Unknown', log: boolean = true) => {
  const renderInfoRef = useRef<UseRenderInfoReturn>({
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
