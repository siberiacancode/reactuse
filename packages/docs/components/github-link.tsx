import { Icons } from '@docs/components/icons';
import { siteConfig } from '@docs/lib/config';
import { Button } from '@docs/ui/button';
import { Skeleton } from '@docs/ui/skeleton';
import Link from 'next/link';
import * as React from 'react';

const StarsCount = async () => {
  const data = await fetch('https://api.github.com/repos/siberiacancode/reactuse', {
    next: { revalidate: 86400 }
  });
  const json = await data.json();

  const formattedCount =
    json.stargazers_count >= 1000
      ? `${Math.round(json.stargazers_count / 1000)}k`
      : json.stargazers_count?.toLocaleString();

  return <span className='text-muted-foreground w-fit text-xs tabular-nums'>{formattedCount}</span>;
};

export const GitHubLink = () => (
  <Button asChild className='h-8 shadow-none' size='sm' variant='ghost'>
    <Link href={siteConfig.links.github} rel='noreferrer' target='_blank'>
      <Icons.gitHub />
      <React.Suspense fallback={<Skeleton className='h-4 w-[42px]' />}>
        <StarsCount />
      </React.Suspense>
    </Link>
  </Button>
);
