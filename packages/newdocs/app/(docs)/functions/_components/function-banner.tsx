import { Separator } from '@docs/ui/separator';
import dynamic from 'next/dynamic';

import { FunctionDemo } from './function-demo';

interface FunctionBannerProps {
  code: string;
  collapsible: boolean;
  language: 'js' | 'jsx' | 'ts' | 'tsx';
  name: string;
  title?: string;
  type: 'helper' | 'hook';
}

export const FunctionBanner = async ({
  code,
  name,
  language,
  type,
  ...props
}: FunctionBannerProps) => {
  const Demo = await dynamic(() => import(`@docs/generated/demos/${type}s/${name}.demo.tsx`));

  return (
    <div className='flex flex-col rounded-2xl border'>
      <div className='demo-ui flex min-h-[250px] items-center justify-center px-16 py-12'>
        <Demo />
      </div>
      <Separator />

      <div>
        <FunctionDemo code={code} {...props} />
      </div>
    </div>
  );
};
