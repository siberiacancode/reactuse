import { useEffect, useState } from 'react';

/**
 * @name useFps
 * @description - Hook that measures frames per second
 * @category Sensors
 *
 * @returns {number} A number which determines frames per second
 *
 * @example
 * const fps = useFps();
 */
export const useFps = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let startTime = performance.now();
    let requestId: number;

    const onRequestAnimationFrame = () => {
      frameCount += 1;
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / elapsedTime);
        setFps(calculatedFps);
        frameCount = 0;
        startTime = currentTime;
      }

      requestId = requestAnimationFrame(onRequestAnimationFrame);
    };

    requestId = requestAnimationFrame(onRequestAnimationFrame);

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  return fps;
};
