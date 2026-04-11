import type {Metadata} from 'next';

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from '@docs/components/page-header';
import { siteConfig } from '@docs/lib/config';
import { getContributors } from '@docs/lib/contributors';
import { Avatar, AvatarFallback, AvatarImage } from '@docs/ui/avatar';
import { Button } from '@docs/ui/button';
import { Separator } from '@docs/ui/separator';
import {
  IconCube3dSphere,
  IconFishHook,
  IconIcons,
  IconPalette,
  IconTree,
  IconUsers,
  IconWorld
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import _metadata from '../../../.source/metadata.json';

const title = 'reactuse';

const description =
  'Improve your react applications with our library 📦 designed for comfort and speed';

const cardsData = [
  {
    title: 'Lightweight & Scalable',
    details:
      'Hooks are lightweight and easy to use, making it simple to integrate into any project.',
    icon: IconCube3dSphere
  },
  {
    title: 'Clean & consistent',
    details: 'Hooks follow a unified approach for consistency and maintainability.',
    icon: IconWorld
  },
  {
    title: 'Customizable',
    details: 'Install and customize hooks effortlessly using our CLI',
    icon: IconPalette
  },
  {
    title: 'Large collection',
    details:
      'Extensive collection of hooks for all your needs, from state management to browser APIs.',
    icon: IconIcons
  },
  {
    title: 'Tree shakable',
    details:
      'The hooks are tree shakable, so you only import the hooks you need in your application.',
    icon: IconTree
  },
  {
    title: 'Active community',
    details: 'Join our active community on Github and help make reactuse even better.',
    icon: IconUsers
  }
];

export const metadata: Metadata = {
  title,
  description
};

export default async function IndexPage() {
  const contributors = await getContributors();

  const hooks = _metadata.hooks;

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader className='relative'>
        <Button
          className='absolute top-15 left-25 hidden rounded-lg rounded-sm p-3 md:flex'
          size='sm'
          variant='secondary'
        >
          <IconFishHook />
          <Link href='/docs'>{hooks.length} hooks ready to use</Link>
        </Button>
        <div className='relative my-2 flex items-center justify-center'>
          <div className='h-[110px] w-[110px] rounded-full bg-[linear-gradient(130deg,#006eff,#00c8ff)] filter-[blur(40px)_opacity(0.35)]' />
          <img
            className='absolute top-1/2 left-1/2 max-h-[110px] max-w-[110px] -translate-x-1/2 -translate-y-1/2'
            src={siteConfig.ogImage}
          />
        </div>
        <PageHeaderHeading className='max-w-4xl text-xl'>
          <span className='bg-[linear-gradient(120deg,_rgb(97,218,251),_rgb(52,119,208))] bg-clip-text pr-2 leading-[1.2] text-transparent'>
            reactuse
          </span>
          the largest and most useful hook library
        </PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild className='h-[31px] rounded-lg' size='sm'>
            <Link href='/docs/installation'>Get Started</Link>
          </Button>
          <Button asChild className='rounded-lg' size='sm' variant='ghost'>
            <Link href='/docs/hooks/useactiveelement'>View hooks</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className='container grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
        {cardsData.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className='bg-card space-y-3 rounded-xl border p-6 py-10'>
              <div className='bg-accent flex h-8 w-8 items-center justify-center rounded border'>
                <Icon size={20} />
              </div>
              <h3 className='text-lg font-semibold'>{card.title}</h3>
              <p className='text-sm text-gray-400'>{card.details}</p>
            </div>
          );
        })}
      </div>
      <div className='mt-20'>
        <div className='mb-10 text-center text-4xl font-bold'>Team & Contributors</div>
        <div className='flex items-center justify-center'>
          <Link href='https://github.com/siberiacancode' rel='noopener noreferrer' target='_blank'>
            <div className='flex items-center justify-center gap-3'>
              <Image
                alt='SIBERIA CAN CODE'
                className='rounded-lg'
                height={40}
                src='https://avatars.githubusercontent.com/u/122668137?s=200&v=4'
                width={40}
              />
              <div className='text-xl font-bold'>SIBERIA CAN CODE</div>
            </div>
          </Link>
        </div>
        <div className='container mt-6 flex flex-wrap justify-center gap-3'>
          {contributors.map((contributor) => (
            <div key={contributor.name} className='flex items-center gap-2.5'>
              <Avatar>
                <AvatarImage alt='@shadcn' src={contributor.avatar} />
                <AvatarFallback>{contributor.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className='mt-1 text-xs'>{contributor.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <Separator className='mt-20 mb-10' />

      <div className='flex flex-col items-center'>
        <span className='text-sm'>Released under the MIT License.</span>
        <span className='text-sm'>Copyright © 2026 siberiacancode</span>
      </div>
    </div>
  );
}
