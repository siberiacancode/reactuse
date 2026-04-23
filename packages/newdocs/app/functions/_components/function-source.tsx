import { Separator } from '@docs/ui/separator';
import dynamic from 'next/dynamic';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { codeToHtml } from 'shiki';

import { FunctionCode } from './function-code';
import { FunctionDemo } from './function-demo';

interface FunctionSourceProps {
  collapsible: boolean;
  file: string;
  language: 'js' | 'jsx' | 'ts' | 'tsx';
  title?: string;
  type: 'helper' | 'hook';
  variant: 'code' | 'demo';
}

const createHtmlCode = async (code: string, language: 'js' | 'jsx' | 'ts' | 'tsx') =>
  await codeToHtml(code, {
    lang: language,
    themes: {
      dark: 'github-dark',
      light: 'github-light'
    },
    transformers: [
      {
        pre(node) {
          node.properties.class =
            'no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent';
        },
        code(node) {
          node.properties['data-line-numbers'] = '';
        },
        line(node) {
          node.properties['data-line'] = '';
        }
      }
    ]
  });

export const FunctionSource = async ({ file, language, type, ...props }: FunctionSourceProps) => {
  if (props.variant === 'code') {
    const code = await fs.readFile(
      path.join(process.cwd(), '..', 'core', 'src', `${type}s`, file, `${file}.${language}`),
      'utf-8'
    );
    const htmlCode = await createHtmlCode(code, language);

    return <FunctionCode code={htmlCode} language={language} {...props} />;
  }

  if (props.variant === 'demo') {
    const demoPath = path.join(
      process.cwd(),
      '..',
      'core',
      'src',
      `${type}s`,
      file,
      `${file}.demo.tsx`
    );

    const Demo = await dynamic(() => import(`@docs/generated/demos/${type}s/${file}.demo.tsx`));
    const code = await fs.readFile(demoPath, 'utf-8');
    const htmlCode = await createHtmlCode(code, language);

    return (
      <div className='flex flex-col rounded-lg border'>
        <div className='demo-ui flex items-center justify-center px-20 py-12'>
          <Demo />
        </div>
        <Separator />

        <div>
          <FunctionDemo code={htmlCode} {...props} />
        </div>
      </div>
    );
  }

  throw new Error(`Invalid variant: ${props.variant}`);
};
