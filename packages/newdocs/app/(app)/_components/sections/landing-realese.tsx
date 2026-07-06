'use client';

import { Badge } from '@/src/components/ui';

interface LandingReleaseProps {
  name: string;
  title: string;
  url: string;
}

export const LandingRelease = ({ name, title, url }: LandingReleaseProps) => (
  <div className='border-border relative flex h-9 items-center justify-center border-b py-6'>
    <a
      className='group text-foreground inline-flex items-center gap-2 text-xs sm:text-sm'
      href={url}
      rel='noreferrer'
      target='_blank'
    >
      <Badge className='h-5 rounded-md px-1.5 py-0 text-[10px] tracking-[0.06em] uppercase'>
        New
      </Badge>
      <span className='text-muted-foreground truncate'>
        <span className='text-foreground font-medium'>{name}</span>
        {` - ${title}`}
      </span>
      <span className='text-muted-foreground transition-transform group-hover:translate-x-0.5'>
        -&gt;
      </span>
    </a>
  </div>
);
