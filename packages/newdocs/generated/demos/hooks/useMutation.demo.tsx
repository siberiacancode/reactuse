'use client'

import { useMutation, useQuery } from '@siberiacancode/reactuse';
import { BadgeCheckIcon, CalendarIcon, Loader2Icon } from 'lucide-react';

interface Profile {
  description: string;
  followers: number;
  following: boolean;
  followingCount: number;
  handle: string;
  joined: string;
  name: string;
}

const profile: Profile = {
  name: 'siberiacancode',
  handle: '@siberiacancode',
  description:
    'We are a group of developers with years of experience. We specialize in development of web applications, servers and browser extensions.',
  joined: 'Joined June 2024',
  following: false,
  followingCount: 892,
  followers: 124000
};

const fetchProfile = () =>
  new Promise<Profile>((resolve) => setTimeout(resolve, 1000, { ...profile }));

const toggleFollow = (next: boolean) =>
  new Promise<Profile>((resolve) =>
    setTimeout(() => {
      profile.following = next;
      profile.followers += next ? 1 : -1;
      resolve({ ...profile });
    }, 1200)
  );

const formatCount = (count: number) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return `${count}`;
};

const Demo = () => {
  const profileQuery = useQuery(fetchProfile, {
    enabled: false,
    placeholderData: profile
  });
  const followMutation = useMutation(toggleFollow);

  const data = profileQuery.data!;

  const onToggleFollow = async () => {
    await followMutation.mutateAsync(!data.following);
    profileQuery.refetch();
  };

  const loading = followMutation.isLoading || profileQuery.isRefetching;

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div className='h-32 w-full rounded-2xl bg-gradient-to-br from-zinc-100 via-stone-200 to-neutral-300' />

      <div className='flex items-end justify-between'>
        <div className='ring-background -mt-12 ml-1 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-2xl font-bold text-white ring-4'>
          SC
        </div>

        <button
          className='group min-w-[112px] rounded-full!'
          data-variant={data.following ? 'outline' : 'default'}
          disabled={loading}
          type='button'
          onClick={onToggleFollow}
        >
          {loading ? (
            <Loader2Icon className='size-4 animate-spin' />
          ) : data.following ? (
            <>
              <span className='group-hover:hidden'>Following</span>
              <span className='hidden group-hover:inline'>Unfollow</span>
            </>
          ) : (
            'Follow'
          )}
        </button>
      </div>

      <div className='mt-3 flex flex-col gap-0.5'>
        <div className='flex items-center gap-1'>
          <span className='text-foreground text-xl font-bold'>{data.name}</span>
          <BadgeCheckIcon className='text-foreground size-5' />
        </div>
        <span className='text-muted-foreground text-sm'>{data.handle}</span>
      </div>

      <p className='text-foreground mt-3 text-sm leading-relaxed'>{data.description}</p>

      <div className='text-muted-foreground mt-3 flex items-center gap-1.5 text-sm'>
        <CalendarIcon className='size-4' />
        <span>{data.joined}</span>
      </div>

      <div className='mt-3 flex gap-5 text-sm'>
        <span className='text-foreground font-bold'>
          {data.followingCount} <span className='text-muted-foreground font-normal'>Following</span>
        </span>
        <span className='text-foreground font-bold'>
          {formatCount(data.followers)}{' '}
          <span className='text-muted-foreground font-normal'>Followers</span>
        </span>
      </div>
    </section>
  );
};

export default Demo;
