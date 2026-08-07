import { Badge, Button } from '@/src/components/ui';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import {
  AstroIcon,
  GithubIcon,
  NextjsIcon,
  ReactRouterIcon,
  TanStackIcon,
  ViteIcon
} from '@/src/components/icons';
import { LINKS } from '@/src/constants';

import { LandingBackdrop } from './landing-backdrop';

const FRAMEWORKS = [
  { icon: ViteIcon, name: 'Vite' },
  { icon: NextjsIcon, name: 'Next.js' },
  { icon: TanStackIcon, name: 'TanStack' },
  { icon: AstroIcon, name: 'Astro' },
  { icon: ReactRouterIcon, name: 'React Router' }
];

/**
 * Bare, slowly spinning React atom in the brand color — the center accent of the
 * headline. No chip or border: it sits inline before the word "ever".
 * Spin keyframes live in globals.css (8s loop, disabled under prefers-reduced-motion).
 */
const AtomAccent = () => (
  <span className='relative inline-flex align-middle'>
    <svg
      aria-hidden='true'
      className='atom-spin text-foreground size-[0.78em] shrink-0'
      fill='none'
      viewBox='-11.5 -10.23 23 20.46'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='0' cy='0' fill='currentColor' r='2.05' />
      <g fill='none' stroke='currentColor' strokeWidth='1'>
        <ellipse rx='11' ry='4.2' />
        <ellipse rx='11' ry='4.2' transform='rotate(60)' />
        <ellipse rx='11' ry='4.2' transform='rotate(120)' />
      </g>
    </svg>
  </span>
);

interface LandingHeroProps {
  hooksCount: string;
  release?: {
    name: string;
    title: string;
    url: string;
  };
}

export const LandingHero = ({ hooksCount, release }: LandingHeroProps) => (
  <section className='relative flex min-h-[65vh] items-center overflow-hidden pt-25'>
    {/* dithered wave canvas — untouched */}
    <LandingBackdrop />

    {/* readability fades — stronger so the backdrop reads as a deep shadow */}
    <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(65%_65%_at_50%_42%,transparent,var(--background))]' />
    {/* bottom shadow — taller/denser blend into the section below */}
    <div className='pointer-events-none absolute inset-x-0 bottom-0 h-350 bg-[linear-gradient(to_top,var(--background)_10%,transparent)]' />

    <div className='relative container w-full'>
      <div className='mx-auto flex max-w-4xl flex-col items-center text-center'>
        {/* release — plain clickable line above the headline, no card wrapper */}
        {release && (
          <a
            className='group text-foreground mb-8 inline-flex items-center gap-2 text-xs sm:text-sm'
            href={release.url}
            rel='noreferrer'
            target='_blank'
          >
            <Badge className='h-5 rounded-md px-1.5 py-0 text-[10px] tracking-[0.06em] uppercase'>
              New
            </Badge>
            <span className='text-muted-foreground truncate'>
              <span className='text-foreground font-medium'>{release.name}</span>
              {` - ${release.title}`}
            </span>
            <ArrowRightIcon className='text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5' />
          </a>
        )}

        {/* serif headline — no backing plate */}
        <h1 className='text-foreground font-serif text-5xl leading-[1.05] font-normal tracking-tight md:text-7xl lg:text-8xl'>
          <span className='italic'>Every</span> hook your app will <AtomAccent /> ever need
        </h1>

        {/* subtitle — no backing plate */}
        <p className='text-muted-foreground mt-6 max-w-xl text-base leading-relaxed md:text-lg'>
          The largest React hooks library. {hooksCount} production-ready hooks — lightweight,
          tree-shakeable, and TypeScript-first.
        </p>

        {/* actions — same shadcn buttons as before */}
        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row'>
          <Button asChild className='group h-11 rounded-full px-7 text-sm'>
            <Link href='/docs/installation' prefetch={false}>
              Get started
              <ArrowRightIcon className='size-4 transition-transform group-hover:translate-x-0.5' />
            </Link>
          </Button>
          <Button asChild className='h-11 rounded-full px-7 text-sm' variant='outline'>
            <Link href={LINKS.GITHUB} prefetch={false} rel='noreferrer' target='_blank'>
              <GithubIcon aria-hidden='true' className='size-4' />
              GitHub
            </Link>
          </Button>
        </div>

        {/* frameworks — plain row, no wrapper (as in the original) */}
        <div className='mt-12 flex flex-col items-center'>
          <p className='text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase'>
            Works with any React framework
          </p>
          <div className='mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3'>
            {FRAMEWORKS.map((framework) => {
              const FrameworkIcon = framework.icon;

              return (
                <span
                  key={framework.name}
                  className='text-muted-foreground flex items-center gap-2'
                >
                  <FrameworkIcon
                    aria-hidden='true'
                    className='size-5 shrink-0'
                    fill='currentColor'
                  />
                  <span className='text-sm font-medium'>{framework.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);
