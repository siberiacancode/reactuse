import type { Metadata } from 'next';

import { getElements } from '@/scripts/helpers';
import { CONFIG } from '@/src/constants';
import { getLatestReleases, getNpmDownloads, getRepository } from '@/src/utils/api';
import { formatCount } from '@/src/utils/helpers';
import { getContributors } from '@/src/utils/server';

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
} from './_components/sections';

export const generateMetadata = async (): Promise<Metadata> => {
  const hooks = await getElements('hook');

  return {
    title: `reactuse ${hooks.length}+ The largest React hooks library.`,
    description: CONFIG.DESCRIPTION,
    openGraph: {
      title: `reactuse ${hooks.length}+ The largest React hooks library.`,
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
      title: `reactuse ${hooks.length}+ The largest React hooks library.`,
      description: CONFIG.DESCRIPTION,
      images: ['/og.png'],
      creator: '@siberiacancode'
    }
  };
};

const HomePage = async () => {
  const [hooks, contributors, repositoryResponse, latestReleasesResponse, npmDownloadsResponse] =
    await Promise.all([
      getElements('hook'),
      getContributors(),
      getRepository(),
      getLatestReleases(),
      getNpmDownloads()
    ]);

  const hooksCount = formatCount(hooks.length);
  const contributorsCount = formatCount(contributors.length, true);
  const stats = [
    { label: 'Hooks', value: hooksCount },
    { label: 'Contributors', value: contributorsCount },
    { label: 'GitHub Stars', value: formatCount(repositoryResponse.data.stargazers_count) },
    { label: 'Weekly Downloads', value: formatCount(npmDownloadsResponse.data.downloads, true) },
    { label: 'TypeScript', value: '100%' },
    { label: 'Dependencies', value: '0' }
  ];

  const lastRelease = latestReleasesResponse.data[0];
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const releaseTitle = lastRelease.body.match(/^#\s+(.+)$/m)?.[1]?.trim();

  return (
    <div>
      <LandingHeader
        releaseName={lastRelease.tag_name}
        stars={repositoryResponse.data.stargazers_count}
      />

      <main>
        <LandingHero
          release={{
            name: lastRelease.tag_name,
            title: releaseTitle!,
            url: lastRelease.html_url
          }}
          hooksCount={hooksCount}
        />
        <LandingBentoHooks />
        <LandingStats stats={stats} />
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
