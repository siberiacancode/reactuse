import type { Metadata } from 'next';

import fetches from '@siberiacancode/fetches';

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
  LandingRelease,
  LandingStats
} from '../_components/sections';

export const metadata: Metadata = {
  title: CONFIG.NAME,
  description: CONFIG.DESCRIPTION,
  openGraph: {
    title: CONFIG.NAME,
    description: CONFIG.DESCRIPTION,
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og.png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.NAME,
    description: CONFIG.DESCRIPTION,
    images: ['/og.png'],
    creator: '@siberiacancode'
  }
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
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const releaseTitle = lastRelease.body.match(/^#\s+(.+)$/m)?.[1]?.trim();

  return (
    <div>
      {latestReleasesResponse.data[0] && (
        <LandingRelease lastRelease={lastRelease} releaseTitle={releaseTitle} />
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
