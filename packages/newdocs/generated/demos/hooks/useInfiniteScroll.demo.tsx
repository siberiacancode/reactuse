'use client'

import { useInfiniteScroll, useList } from '@siberiacancode/reactuse';
import { HeartIcon, Loader2Icon, MessageCircleIcon, Repeat2Icon } from 'lucide-react';

interface Post {
  handle: string;
  id: string;
  image?: string;
  likes: number;
  logo: string;
  name: string;
  replies: number;
  reposts: number;
  text: string;
  time: string;
}

const POSTS = [
  {
    name: 'Vercel',
    handle: 'vercel',
    logo: 'https://cdn.simpleicons.org/vercel/000000/ffffff',
    text: 'we just deployed our 100,000,000th preview. thanks to everyone who builds with us 🩷',
    image: 'https://cdn.simpleicons.org/vercel/000000/ffffff'
  },
  {
    name: 'Next.js',
    handle: 'nextjs',
    logo: 'https://cdn.simpleicons.org/nextdotjs/000000/ffffff',
    text: 'Just shipped Next.js 15.2 — incremental cache, faster cold starts and better DX 🚀'
  },
  {
    name: 'React',
    handle: 'reactjs',
    logo: 'https://cdn.simpleicons.org/react',
    text: 'tabs or spaces?'
  },
  {
    name: 'TypeScript',
    handle: 'typescript',
    logo: 'https://cdn.simpleicons.org/typescript',
    text: 'TypeScript 5.5 is out today. Inferred type predicates, regex literals 🎉',
    image: 'https://cdn.simpleicons.org/typescript'
  },
  {
    name: 'Tailwind CSS',
    handle: 'tailwindcss',
    logo: 'https://cdn.simpleicons.org/tailwindcss',
    text: 'Built-in dark mode arrives in v4.1. No config, no plugin — just data-theme on html and you are done.'
  },
  {
    name: 'GitHub',
    handle: 'github',
    logo: 'https://cdn.simpleicons.org/github/000000/ffffff',
    text: 'monorepo vs polyrepo... discuss ☕'
  },
  {
    name: 'reactuse',
    handle: 'reactuse',
    logo: 'https://cdn.simpleicons.org/react',
    text: "ESM is the future. CommonJS days are numbered. Don't @ me.",
    image: 'https://cdn.simpleicons.org/react'
  },
  {
    name: 'Vercel',
    handle: 'vercel',
    logo: 'https://cdn.simpleicons.org/vercel/000000/ffffff',
    text: 'serverless is great until the cold start hits at 2am'
  },
  {
    name: 'React',
    handle: 'reactjs',
    logo: 'https://cdn.simpleicons.org/react',
    text: 'New blog post: how we cut bundle size by 40% by removing one polyfill. Read the full breakdown on the blog',
    image: 'https://cdn.simpleicons.org/tailwindcss'
  },
  {
    name: 'GitHub',
    handle: 'github',
    logo: 'https://cdn.simpleicons.org/github/000000/ffffff',
    text: 'release notes for the v18 update are live — check the changelog for breaking changes before you upgrade'
  }
];

const createPost = (index: number): Post => {
  const template = POSTS[index % POSTS.length];
  const minutes = Math.floor(Math.random() * 600);
  const time = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h`;

  return {
    id: crypto.randomUUID(),
    ...template,
    time,
    likes: Math.floor(Math.random() * 2400),
    replies: Math.floor(Math.random() * 200),
    reposts: Math.floor(Math.random() * 600)
  };
};

const formatCount = (count: number) => {
  if (count < 1000) return count.toString();
  return `${(count / 1000).toFixed(1)}K`;
};

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => (
  <article className='border-border flex flex-col gap-1.5 border-b py-3 last:border-b-0'>
    <div className='flex items-center gap-2'>
      <div className='bg-muted/40 flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full'>
        <img alt={post.name} className='size-4 object-contain' src={post.logo} />
      </div>
      <span className='text-foreground text-sm font-semibold'>{post.name}</span>
      <span className='text-muted-foreground text-xs'>@{post.handle}</span>
      <span className='text-muted-foreground text-xs'>· {post.time}</span>
    </div>

    <p className='text-foreground text-sm leading-relaxed'>{post.text}</p>

    {post.image && (
      <div className='border-border bg-muted/40 mt-1 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border'>
        <img alt='Post attachment' className='size-1/3 object-contain' src={post.image} />
      </div>
    )}

    <div className='text-muted-foreground mt-1 flex items-center gap-5'>
      <span className='hover:text-foreground flex cursor-pointer items-center gap-1.5 text-xs transition-colors'>
        <MessageCircleIcon className='size-3.5' />
        {formatCount(post.replies)}
      </span>
      <span className='flex cursor-pointer items-center gap-1.5 text-xs transition-colors hover:text-green-500'>
        <Repeat2Icon className='size-3.5' />
        {formatCount(post.reposts)}
      </span>
      <span className='hover:text-destructive flex cursor-pointer items-center gap-1.5 text-xs transition-colors'>
        <HeartIcon className='size-3.5' />
        {formatCount(post.likes)}
      </span>
    </div>
  </article>
);

const Demo = () => {
  const list = useList<Post>(Array.from({ length: 8 }, (_, i) => createPost(i)));

  const feed = useInfiniteScroll<HTMLDivElement>(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      list.set((current) => [
        ...current,
        ...Array.from({ length: 5 }, (_, i) => createPost(current.length + i))
      ]);
    },
    { distance: 80 }
  );

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div ref={feed.ref} className='no-scrollbar flex h-[480px] flex-col overflow-y-auto'>
        {list.value.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {feed.loading && (
          <div className='flex items-center justify-center gap-2 py-4'>
            <Loader2Icon className='text-muted-foreground size-4 animate-spin' />
            <span className='text-muted-foreground text-xs'>Loading more posts...</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
