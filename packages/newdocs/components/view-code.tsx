'use client';

import { Button } from '@docs/ui/button';
import { useState } from 'react';

type ViewCodeProps = {
  children: React.ReactNode;
  lineCount?: number;
};

export const ViewCode = ({ children, lineCount = 0 }: ViewCodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowToggle = lineCount > 20;
  const containerClassName = shouldShowToggle
    ? isExpanded
      ? 'no-scrollbar relative max-h-[500px] overflow-auto transition-[max-height] duration-300 ease-in-out'
      : 'relative max-h-[340px] overflow-hidden transition-[max-height] duration-300 ease-in-out'
    : 'no-scrollbar relative overflow-auto';

  return (
    <div className='relative overflow-hidden rounded-xl'>
      <div className={containerClassName}>{children}</div>

      {shouldShowToggle && !isExpanded && (
        <div className='pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-36 rounded-b-xl bg-gradient-to-t from-[var(--color-code)] to-transparent' />
      )}

      {shouldShowToggle && !isExpanded && (
        <div className='absolute right-0 bottom-10 left-0 z-20 flex justify-center'>
          <Button
            className='h-9 px-4 text-sm font-medium'
            size='sm'
            variant='secondary'
            onClick={() => setIsExpanded(true)}
          >
            View code
          </Button>
        </div>
      )}
    </div>
  );
};
