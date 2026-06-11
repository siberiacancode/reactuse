'use client'

import { useLockCallback, useQuery } from '@siberiacancode/reactuse';
import { EyeIcon, GitForkIcon, Loader2Icon, StarIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Repo {
  description: string | null;
  forks_count: number;
  full_name: string;
  owner: { avatar_url: string };
  stargazers_count: number;
  watchers_count: number;
}

const REPOS = ['vercel/next.js', 'facebook/react', 'shadcn-ui/ui', 'siberiacancode/reactuse'];

const fetchRepo = async (fullName: string): Promise<Repo> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return fetch(`https://api.github.com/repos/${fullName}`).then((response) => response.json());
};

const formatCount = (count: number) => {
  if (count < 1000) return count.toString();
  if (count < 1_000_000) return `${(count / 1000).toFixed(1)}k`;
  return `${(count / 1_000_000).toFixed(1)}M`;
};

interface RepoLinkProps {
  active: boolean;
  name: string;
  onClick: (name: string) => void;
}

const RepoLink = ({ name, active, onClick }: RepoLinkProps) => (
  <span
    className={cn(
      'cursor-pointer rounded-sm rounded-sm! px-0.5 font-medium underline underline-offset-2 transition-colors',
      active
        ? 'bg-foreground/10 text-foreground decoration-foreground'
        : 'text-foreground decoration-foreground/40 hover:decoration-foreground'
    )}
    onClick={() => onClick(name)}
  >
    {name}
  </span>
);

interface RepoCardProps {
  loading: boolean;
  repo?: Repo;
}

const RepoCard = ({ repo, loading }: RepoCardProps) => (
  <aside className='border-border bg-card flex h-[100px] w-full shrink-0 flex-col gap-3 rounded-xl border p-4 shadow-sm sm:h-[180px] sm:w-[220px]'>
    {loading && (
      <div className='flex flex-1 items-center justify-center'>
        <Loader2Icon className='text-muted-foreground size-5 animate-spin' />
      </div>
    )}

    {!loading && repo && (
      <>
        <div className='flex items-center gap-2'>
          <div className='size-8 rounded-md' data-slot='avatar'>
            <img
              alt={repo.full_name}
              className='object-cover'
              data-slot='avatar-image'
              src={repo.owner.avatar_url}
            />
          </div>
          <div className='flex min-w-0 flex-1 flex-col leading-tight'>
            <span className='text-muted-foreground truncate text-[10px]'>
              {repo.full_name.split('/')[0]}
            </span>
            <span className='text-foreground truncate text-sm font-semibold'>
              {repo.full_name.split('/')[1]}
            </span>
          </div>
        </div>

        {repo.description && (
          <p className='text-muted-foreground hidden min-h-[32px] text-xs leading-relaxed sm:line-clamp-2'>
            {repo.description}
          </p>
        )}

        <div className='border-border mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t pt-3 text-[10px]'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <StarIcon className='size-3' />
            <span className='text-foreground font-mono font-semibold tabular-nums'>
              {formatCount(repo.stargazers_count)}
            </span>
          </span>
          <span className='text-muted-foreground flex items-center gap-1'>
            <GitForkIcon className='size-3' />
            <span className='text-foreground font-mono font-semibold tabular-nums'>
              {formatCount(repo.forks_count)}
            </span>
          </span>
          <span className='text-muted-foreground flex items-center gap-1'>
            <EyeIcon className='size-3' />
            <span className='text-foreground font-mono font-semibold tabular-nums'>
              {formatCount(repo.watchers_count)}
            </span>
          </span>
        </div>
      </>
    )}
  </aside>
);

const Demo = () => {
  const [activeName, setActiveName] = useState<string>(REPOS[0]);

  const repoQuery = useQuery<Repo>(() => fetchRepo(activeName), {
    keys: [activeName]
  });

  const onSelect = useLockCallback(async (name: string) => {
    setActiveName(name);
    await new Promise((resolve) => setTimeout(resolve, 600));
  });

  return (
    <section className='flex w-full max-w-2xl flex-col gap-4 p-4'>
      <h2 className='text-foreground text-base font-semibold'>The stack behind modern frontend</h2>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
        <p className='text-muted-foreground order-2 flex-1 text-base leading-relaxed select-none sm:order-1'>
          Modern web stacks evolve fast. We deploy our apps on{' '}
          <RepoLink
            active={activeName === 'vercel/next.js'}
            name='vercel/next.js'
            onClick={onSelect}
          />
          , the React Framework that powers production at companies like TikTok and Notion. The UI
          layer is built with{' '}
          <RepoLink
            active={activeName === 'facebook/react'}
            name='facebook/react'
            onClick={onSelect}
          />
          , styled with components from{' '}
          <RepoLink active={activeName === 'shadcn-ui/ui'} name='shadcn-ui/ui' onClick={onSelect} />
          , and for utility hooks we rely on{' '}
          <RepoLink
            active={activeName === 'siberiacancode/reactuse'}
            name='siberiacancode/reactuse'
            onClick={onSelect}
          />{' '}
          which keeps our codebase concise and fully typed.
        </p>

        <div className='order-1 sm:order-2'>
          <RepoCard loading={repoQuery.isLoading || repoQuery.isRefetching} repo={repoQuery.data} />
        </div>
      </div>
    </section>
  );
};

export default Demo;
