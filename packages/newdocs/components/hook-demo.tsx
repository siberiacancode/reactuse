'use client';

import type { HookProps } from '@docs/lib/parse-hook';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export const HookDemo = (props: HookProps) => {
  const Demo = useMemo(() => {
    if (!props.hasDemo) {
      return null;
    }

    if (props.type === 'helper') {
      return dynamic(
        () =>
          import(`@/helpers/${props.name}/${props.name}.demo.tsx`).catch(() => ({
            default: () => null
          })),
        { ssr: false }
      );
    }

    return dynamic(
      () =>
        import(`@/hooks/${props.name}/${props.name}.demo.tsx`).catch(() => ({
          default: () => null
        })),
      { ssr: false }
    );
  }, [props.hasDemo, props.name, props.type]);

  if (!Demo) {
    return null;
  }

  return (
    <div className='demo-hook-example relative mb-2 rounded-lg bg-[var(--color-code)] p-6'>
      <Demo />
    </div>
  );
};
