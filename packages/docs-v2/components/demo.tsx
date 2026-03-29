'use client';

import { HookProps } from '@/lib/parse-hook';
import { ExamplesIndex } from '../.source/demo';

export const DocDemo = (props: HookProps) => {
  const example = ExamplesIndex[props.name];

  if (!example) {
    return null;
  }

  const Demo = example.component;

  return <Demo />;
};
