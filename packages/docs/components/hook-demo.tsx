'use client';

import type { HookProps } from '@docs/lib/parse-hook';

import { cx } from 'class-variance-authority';

import { ExamplesIndex } from '../.source/demo';
import { ComponentWrapper } from './component-wrapper';

export const DocDemo = (props: HookProps) => {
  const Demo = ExamplesIndex[props.name];

  if (!Demo) {
    return null;
  }

  return (
    <ComponentWrapper name={props.name}>
      <div className={cx(['demo-hook-example', 'mt-4 rounded-xl bg-[var(--color-code)] p-6'])}>
        <Demo />
      </div>
    </ComponentWrapper>
  );
};
