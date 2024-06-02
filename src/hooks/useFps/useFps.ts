import { useEffect, useState } from 'react';

/**
 * @name useFps
 * @description - Hook that measures frames per second
 *
 * @template Value The type of the value
 *
 * @returns {number} A number which determines frames per second
 *
 * @example
 * const fps = useFps();
 */
export const useFps = (): number => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let startTime = performance.now();
    let requestId: number;

    const updateFps = () => {
      frameCount += 1;
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / elapsedTime);
        setFps(calculatedFps);
        frameCount = 0;
        startTime = currentTime;
      }

      requestId = requestAnimationFrame(updateFps);
    };

    requestId = requestAnimationFrame(updateFps);

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  return fps;
};
