import type { ImageResponseOptions } from 'next/server';

import { Buffer } from 'node:buffer';

export type FontOptions = NonNullable<ImageResponseOptions['fonts']>[number];
export const loadAssets = async (): Promise<FontOptions[]> => {
  const [normal, semibold] = await Promise.all([
    import('../geist-regular-otf.json').then((mod) => mod.default),
    import('../geist-regular-otf.json').then((mod) => mod.default)
  ]);

  return [
    {
      name: 'Geist',
      data: Buffer.from(normal.base64Font, 'base64'),
      weight: 400,
      style: 'normal'
    },
    {
      name: 'Geist',
      data: Buffer.from(semibold.base64Font, 'base64'),
      weight: 600,
      style: 'normal'
    }
  ];
};
