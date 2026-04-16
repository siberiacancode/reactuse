'use client';

import { useCopyToClipboard } from '@docs/hooks/use-copy-to-clipboard';
import { Button } from '@docs/ui/button';
import { Separator } from '@docs/ui/separator';
import { IconCheck, IconCopy } from '@tabler/icons-react';

export const DocsCopyPage = ({ page }: { page: string }) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <div className='bg-secondary group/buttons relative flex rounded-lg *:[[data-slot=button]]:focus-visible:relative *:[[data-slot=button]]:focus-visible:z-10'>
      <Button
        className='h-8 cursor-pointer shadow-none md:h-7 md:text-[0.8rem]'
        size='sm'
        variant='secondary'
        onClick={() => copyToClipboard(page)}
      >
        {isCopied ? <IconCheck /> : <IconCopy />}
        Copy Page
      </Button>
      <Separator
        className='!bg-foreground/5 absolute top-1 right-8 z-0 !h-6 peer-focus-visible:opacity-0 sm:right-7 sm:!h-5'
        orientation='vertical'
      />
    </div>
  );
};
