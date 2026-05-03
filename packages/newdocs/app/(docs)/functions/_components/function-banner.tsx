import { Separator } from '@docs/ui/separator';
import dynamic from 'next/dynamic';

import { Button } from '@/ui/button';

import { FunctionDemo } from './function-demo';

interface FunctionBannerProps {
  browserapi?: {
    name: string;
    description: string;
  };
  code: string;
  collapsible: boolean;
  language: 'js' | 'jsx' | 'ts' | 'tsx';
  name: string;
  title?: string;
  type: 'helper' | 'hook';
}

export const FunctionBanner = async ({
  code,
  browserapi,
  name,
  language,
  type,
  ...props
}: FunctionBannerProps) => {
  const Demo = await dynamic(() => import(`@docs/generated/demos/${type}s/${name}.demo.tsx`));

  return (
    <div className='flex flex-col overflow-hidden rounded-2xl border'>
      <div className='demo-ui flex min-h-[350px] items-center justify-center px-18 py-12'>
        <Demo />
      </div>

      <div>
        <FunctionDemo code={code} {...props} />
      </div>

      {browserapi && (
        <>
          <Separator />

          <p className='text-muted-foreground p-4 text-sm'>
            This hook uses <span className='text-[var(--brand-hex)]'>{browserapi.name}</span>{' '}
            browser api to provide enhanced functionality. Make sure to check for compatibility with
            different browsers when using this{' '}
            <Button asChild className='p-0' variant='link'>
              <a href={browserapi.description} rel='noopener noreferrer' target='_blank'>
                api
              </a>
            </Button>
          </p>
        </>
      )}
    </div>
  );
};
