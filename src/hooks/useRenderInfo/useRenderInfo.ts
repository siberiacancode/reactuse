import { useRef } from 'react';

export interface RenderInfo {
  component: string;
  renders: number;
  timestamp: null | number;
  sinceLast: null | number;
}

/**
 * @name useRenderInfo
 * @description - Hook for getting information about component rerender
 *
 * @param {string} [name='Unknown'] Component name
 * @param {boolean} [log=true] Enable or disable console logs
 * @returns {useRenderInfoReturns} Object containing rerender information
 *
 * @example
 * const rerenderInfo = useRenderInfo();
 */

export const useRenderInfo = (name: string = 'Unknown', log: boolean = true) => {
  const { current: info } = useRef<RenderInfo>({
    component: name,
    renders: 0,
    timestamp: null,
    sinceLast: null
  });
  const now = +Date.now();

  info.renders += 1;
  info.sinceLast = info.timestamp && (now - info.timestamp) / 1000;
  info.timestamp = now;

  if (log) {
    console.group(`${name} info`);
    console.log(
      `Render: ${info.renders} ${info.renders > 1 ? `, ${info.sinceLast}s since last render` : ''}`
    );
    console.dir(info);
    console.groupEnd();
  }

  return { ...info };
};
