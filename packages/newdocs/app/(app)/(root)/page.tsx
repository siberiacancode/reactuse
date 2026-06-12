import type { Metadata } from 'next';

import { LandingHero } from '@docs/components/landing-hero';
import {
  LandingBentoHooks,
  LandingCli,
  LandingContributors,
  LandingFaq,
  LandingFooter,
  LandingGettingStarted
} from '@docs/components/sections';
import { siteConfig } from '@docs/lib/config';

import { LandingStats } from '@/components/sections/landing-stats';

const title = 'reactuse';
const description = siteConfig.description;

const stats = [
  { label: 'Hooks', value: '158+' },
  { label: 'Contributors', value: '60+' },
  { label: 'GitHub Stars', value: '3K+' },
  { label: 'Weekly Downloads', value: '50K+' },
  { label: 'TypeScript', value: '100%' },
  { label: 'Dependencies', value: '0' }
];

const advantages = [
  {
    description:
      'Minimal footprint with zero dependencies. Each hook is optimized for maximum performance.',
    number: '01',
    title: 'Lightweight'
  },
  {
    description: 'Unified patterns across all hooks for predictable, maintainable code.',
    number: '02',
    title: 'Consistent API'
  },
  {
    description: 'Install via CLI or copy directly. Configure hooks to fit your exact needs.',
    number: '03',
    title: 'Customizable'
  },
  {
    description: 'From state management to browser APIs, sensors, elements, and utilities.',
    number: '04',
    title: '158+ Hooks'
  },
  {
    description: 'Import only what you need. Unused hooks are excluded from your bundle.',
    number: '05',
    title: 'Tree Shakeable'
  },
  {
    description: '60+ contributors, actively maintained with regular updates and new hooks.',
    number: '06',
    title: 'Community Driven'
  }
];

export const metadata: Metadata = {
  title,
  description
};

const HomePage = () => (
  <div className='bg-background min-h-screen'>
    <main>
      <LandingHero />
      <LandingStats stats={stats} />

      <section className='border-border border-t'>
        <div className='mx-auto max-w-6xl px-6 py-24 md:py-32'>
          <h2 className='font-display text-foreground text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl'>
            Why reactuse?
          </h2>

          <div className='mt-12 flex flex-col gap-0 md:mt-16'>
            {advantages.map((advantage) => (
              <div
                key={advantage.title}
                className='group border-border/40 flex items-start gap-6 border-b py-5 transition-colors last:border-0 hover:border-[color:color-mix(in_oklab,var(--brand)_30%,transparent)] md:gap-8'
              >
                <span className='font-display text-muted-foreground/40 pt-1 text-3xl leading-none transition-colors group-hover:text-[var(--brand)] md:text-4xl'>
                  {advantage.number}
                </span>
                <div className='flex-1'>
                  <h3 className='font-display text-foreground text-2xl font-semibold transition-colors group-hover:text-[var(--brand)] md:text-3xl'>
                    {advantage.title}
                  </h3>
                  <p className='text-muted-foreground mt-2 max-w-2xl text-base leading-relaxed md:text-lg'>
                    {advantage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingBentoHooks />
      <LandingCli />
      <LandingGettingStarted />
      <LandingFaq />
      <LandingContributors />
    </main>

    <LandingFooter />
  </div>
);

export default HomePage;
