'use client';

import { Button } from '@docs/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@docs/ui/collapsible';
import { Separator } from '@docs/ui/separator';
import { useCopy } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

interface FunctionCodeProps {
  code: string;
  collapsible: boolean;
  language: 'js' | 'jsx' | 'ts' | 'tsx';
  title?: string;
}

export const FunctionCode = ({ code, collapsible, title, language }: FunctionCodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { copied, copy } = useCopy(2000);

  const onCopyClick = () => copy(code);

  if (!collapsible) {
    return (
      <Collapsible
        className='group/collapsible relative md:-mx-1'
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className='absolute top-1.5 right-2 z-10 flex items-center'>
          <CollapsibleTrigger asChild>
            <Button className='text-muted-foreground h-7 rounded-md px-2' size='sm' variant='ghost'>
              {isOpen ? 'Collapse' : 'Expand'}
            </Button>
          </CollapsibleTrigger>
          <Separator className='mx-1.5 h-4!' orientation='vertical' />
          <Button size='icon-sm' variant='ghost' onClick={onCopyClick}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
        <CollapsibleContent
          forceMount
          className='relative my-6 overflow-hidden data-[state=closed]:max-h-64 data-[state=closed]:[content-visibility:auto] [&>figure]:mt-0 [&>figure]:md:mx-0!'
        >
          <figure className='' data-rehype-pretty-code-figure=''>
            {title && (
              <figcaption
                className='text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70'
                data-language={language}
              >
                {title}
              </figcaption>
            )}
            <div dangerouslySetInnerHTML={{ __html: code }} />
          </figure>
        </CollapsibleContent>
        <CollapsibleTrigger className='from-code/70 to-code text-muted-foreground absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b text-sm group-data-[state=open]/collapsible:hidden'>
          <Button asChild size='sm' variant='ghost'>
            <div>{isOpen ? 'Collapse' : 'Expand'}</div>
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: code }} />;
};
