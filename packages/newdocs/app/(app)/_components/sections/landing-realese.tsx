'use client';

import { Badge } from '@/src/components/ui';

interface LandingReleaseProps {
  lastRelease: {
    html_url: string;
    tag_name: string;
  };
  releaseTitle?: string;
}

export const LandingRelease = ({ lastRelease, releaseTitle }: LandingReleaseProps) => (
  <div className='border-border relative flex h-9 items-center justify-center border-b py-6'>
    <a
      className='group text-foreground inline-flex items-center gap-2 text-xs sm:text-sm'
      href={lastRelease.html_url}
      rel='noreferrer'
      target='_blank'
    >
      <Badge className='h-5 rounded-md px-1.5 py-0 text-[10px] tracking-[0.06em] uppercase'>
        New
      </Badge>
      <span className='text-muted-foreground truncate'>
        <span className='text-foreground font-medium'>{lastRelease.tag_name}</span>
        {releaseTitle && ` - ${releaseTitle}`}
      </span>
      <span className='text-muted-foreground transition-transform group-hover:translate-x-0.5'>
        -&gt;
      </span>
    </a>
  </div>
);
