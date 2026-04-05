import * as React from 'react';
import Link from 'next/link';

import { siteConfig } from '@docs/lib/config';
import { Icons } from '@docs/components/icons';
import { Button } from '@docs/ui/button';
import { Skeleton } from '@docs/ui/skeleton';

export function GitHubLink() {
  return (
    <Button asChild size='sm' variant='ghost' className='h-8 shadow-none'>
      <Link href={siteConfig.links.github} target='_blank' rel='noreferrer'>
        <Icons.gitHub />
        <React.Suspense fallback={<Skeleton className='h-4 w-[42px]' />}>
          <StarsCount />
        </React.Suspense>
      </Link>
    </Button>
  );
}

async function StarsCount() {
  const data = await fetch('https://api.github.com/repos/siberiacancode/reactuse', {
    next: { revalidate: 86400 }
  });
  const json = await data.json();

  const formattedCount =
    json.stargazers_count >= 1000
      ? `${Math.round(json.stargazers_count / 1000)}k`
      : json.stargazers_count.toLocaleString();

  return <span className='text-muted-foreground w-fit text-xs tabular-nums'>{formattedCount}</span>;
}
