'use client';

import { Button } from '@docs/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@docs/ui/collapsible';
import { useCopy } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

interface FunctionDemoProps {
  code: string;
}

export const FunctionDemo = ({ code }: FunctionDemoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { copied, copy } = useCopy(2000);

  const onCopyClick = () => copy(code);

  return (
    <Collapsible className='group/collapsible relative' open={isOpen} onOpenChange={setIsOpen}>
      {isOpen && (
        <div className='absolute top-4 right-4 z-10 flex items-center'>
          <Button className='bg-code' size='icon' variant='ghost' onClick={onCopyClick}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
      )}
      <CollapsibleContent
        forceMount
        className='relative overflow-hidden data-[state=closed]:max-h-42 data-[state=closed]:[content-visibility:auto] data-[state=open]:max-h-92 data-[state=open]:overflow-y-auto [&::-webkit-scrollbar]:hidden [&>figure]:mt-0 [&>figure]:md:mx-0!'
      >
        <figure className='relative bg-[var(--color-code)]'>
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </figure>
      </CollapsibleContent>

      <div className='from-code/30 to-code text-muted-foreground absolute inset-x-0 bottom-0 flex h-full items-center justify-center rounded-b-lg bg-gradient-to-b text-sm group-data-[state=open]/collapsible:hidden'>
        <CollapsibleTrigger asChild>
          <Button size='sm'>{isOpen ? 'Collapse' : 'Expand'}</Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
};
