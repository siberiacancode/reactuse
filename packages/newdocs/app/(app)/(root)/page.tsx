import type { Metadata } from 'next';

import fetches from '@siberiacancode/fetches';
import { Badge } from 'lucide-react';
import Link from 'next/link';

import { getContributors } from '@/lib/contributors';
import { getElements } from '@/scripts/helpers';
import { CONFIG } from '@/src/constants';
import { getLatestReleases, getRepository } from '@/src/utils/api/github';

import {
  LandingAdvantages,
  LandingBentoHooks,
  LandingCli,
  LandingContributors,
  LandingFaq,
  LandingFooter,
  LandingGettingStarted,
  LandingHeader,
  LandingHero,
  LandingStats
} from '../_components/sections';

export const metadata: Metadata = {
  title: CONFIG.NAME,
  description: CONFIG.DESCRIPTION
};

const formatMetricCount = (count: number) => {
  if (count < 1000) return `${count}+`;
  return `${Math.round(count / 1000)}K+`;
};

interface NpmDownloadsResponse {
  downloads: number;
}

const HomePage = async () => {
  const [hooks, contributors, repositoryResponse, latestReleasesResponse, npmDownloadsResponse] =
    await Promise.all([
      getElements('hook'),
      getContributors(),
      getRepository(),
      getLatestReleases(),
      fetches.get<NpmDownloadsResponse>(
        `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent('@siberiacancode/reactuse')}`,
        {
          cache: 'force-cache'
        }
      )
    ]);

  const hooksCount = formatMetricCount(hooks.length);
  const contributorsCount = formatMetricCount(contributors.length);
  const stats = [
    { label: 'Hooks', value: hooksCount },
    { label: 'Contributors', value: contributorsCount },
    { label: 'GitHub Stars', value: formatMetricCount(repositoryResponse.data.stargazers_count) },
    { label: 'Weekly Downloads', value: formatMetricCount(npmDownloadsResponse.data.downloads) },
    { label: 'TypeScript', value: '100%' },
    { label: 'Dependencies', value: '0' }
  ];

  const lastRelease = latestReleasesResponse.data[0];

  return (
    <div>
      {latestReleasesResponse.data[0] && (
        <div className='border-border relative flex h-9 items-center justify-center border-b py-6'>
          <Link
            className='group text-foreground inline-flex items-center gap-2 text-xs sm:text-sm'
            href={lastRelease.html_url}
            rel='noreferrer'
            target='_blank'
          >
            <Badge className='h-5 rounded-md px-1.5 py-0 text-[10px] tracking-[0.06em] uppercase'>
              New
            </Badge>
            <span className='text-muted-foreground truncate'>
              <span className='text-foreground font-medium'>v{lastRelease.tag_name}</span>
              {lastRelease.tag_name && ` - ${lastRelease.tag_name}`}
            </span>
            <span className='text-muted-foreground transition-transform group-hover:translate-x-0.5'>
              -&gt;
            </span>
          </Link>
        </div>
      )}

      <LandingHeader
        hooks={hooks}
        repository={{ stargazersCount: repositoryResponse.data.stargazers_count }}
      />

      <main>
        <LandingHero hooksCount={hooksCount} />
        <LandingStats stats={stats} />
        <LandingBentoHooks hooks={hooks} />
        <LandingAdvantages contributorsCount={contributorsCount} hooksCount={hooksCount} />
        <LandingGettingStarted />
        <LandingCli />
        <LandingFaq />
        <LandingContributors contributors={contributors} />
      </main>

      <LandingFooter />
    </div>
  );
};

export default HomePage;
