import { Icons } from '@docs/components/icons';
import { functionsSource, source } from '@docs/lib/source';
import { CONFIG, LINKS } from '@docs/src/constants';
import fetches from '@siberiacancode/fetches';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/src/components/ui';

import { Burger, Search, ThemeButton } from './components';

const formatStarsCount = (count: number) => {
  if (count < 1000) return count;
  return `${Math.round(count / 1000)}${count >= 1000 ? 'k' : ''}`;
};

export const Header = async () => {
  const repositoryResponse = await fetches.get<{ stargazers_count: number }>(
    'https://api.github.com/repos/siberiacancode/reactuse',
    {
      next: { revalidate: 86400 }
    }
  );

  const formattedCount = formatStarsCount(repositoryResponse.data.stargazers_count);

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full backdrop-blur'>
      <div className='container-wrapper flex h-(--header-height) items-center justify-between gap-3 px-6'>
        <Burger
          className='lg:hidden'
          items={[{ href: '/docs/installation', label: 'Get started' }]}
        />

        <div className='hidden min-w-0 items-center justify-between gap-3 lg:flex'>
          <Link className='inline-flex items-center gap-2' href='/'>
            <Image alt='ReactUse' height={14} src='/logo.svg' width={14} />

            <span className='text-foreground text-xl font-semibold tracking-tight'>
              {CONFIG.NAME}
            </span>
          </Link>

          <Button asChild className='rounded-full' size='sm' variant='ghost'>
            <Link href='/docs/installation'>Docs</Link>
          </Button>
        </div>

        <div className='flex min-w-0 items-center justify-end gap-2'>
          <div className='hidden md:block'>
            <Search tree={[...source.pageTree.children, ...functionsSource.pageTree.children]} />
          </div>

          <div className='flex items-center gap-1'>
            <Button asChild className='rounded-full' variant='ghost'>
              <Link href={LINKS.GITHUB} rel='noreferrer' target='_blank'>
                <Icons.gitHub className='size-4.5' />

                <span className='text-muted-foreground text-xs tabular-nums'>{formattedCount}</span>
              </Link>
            </Button>

            <Button asChild className='rounded-full' size='icon' variant='ghost'>
              <Link href={LINKS.NPM} rel='noreferrer' target='_blank'>
                <Icons.npm className='size-4.5' />
              </Link>
            </Button>

            <ThemeButton />
          </div>
        </div>
      </div>
    </header>
  );
};
