'use client';

import { HookProps } from '@docs/lib/parse-hook';
import { ExamplesIndex } from '../.source/demo';
import { cx } from 'class-variance-authority';

export const DocDemo = (props: HookProps) => {
  const Demo = ExamplesIndex[props.name];

  if (!Demo) {
    return null;
  }

  return (
    <div className={cx(['demo-hook-example', 'mt-4 rounded-xl bg-[var(--color-code)] p-6'])}>
      <Demo />
    </div>
  );
};
