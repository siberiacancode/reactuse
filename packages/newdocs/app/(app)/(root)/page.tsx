import type { Metadata } from 'next';

import { siteConfig } from '@docs/lib/config';
import fetches from '@siberiacancode/fetches';

import { getContributors } from '@/lib/contributors';
import { getElements } from '@/scripts/helpers';

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

const title = 'reactuse';
const description = siteConfig.description;

export const metadata: Metadata = {
  title,
  description
};

const formatMetricCount = (count: number) => {
  if (count < 1000) return `${count}+`;
  return `${Math.round(count / 1000)}K+`;
};

const HomePage = async () => {
  const [hooks, contributors, repositoryResponse] = await Promise.all([
    getElements('hook'),
    getContributors(),
    fetches.get<{ stargazers_count: number }>(
      'https://api.github.com/repos/siberiacancode/reactuse',
      {
        cache: 'force-cache'
      }
    )
  ]);

  const repository = {
    stargazersCount: repositoryResponse.data.stargazers_count
  };
  const hooksCount = formatMetricCount(hooks.length);
  const contributorsCount = formatMetricCount(contributors.length);
  const stats = [
    { label: 'Hooks', value: hooksCount },
    { label: 'Contributors', value: contributorsCount },
    { label: 'GitHub Stars', value: formatMetricCount(repository.stargazersCount) },
    { label: 'Weekly Downloads', value: '50K+' },
    { label: 'TypeScript', value: '100%' },
    { label: 'Dependencies', value: '0' }
  ];

  return (
    <div>
      <LandingHeader hooks={hooks} repository={repository} />

      <main>
        <LandingHero hooksCount={hooksCount} />
        <LandingStats stats={stats} />
        <LandingBentoHooks hooks={hooks} />
        <LandingAdvantages contributorsCount={contributorsCount} hooksCount={hooksCount} />
        <LandingCli />
        <LandingGettingStarted />
        <LandingFaq />
        <LandingContributors contributors={contributors} />
      </main>

      <LandingFooter />
    </div>
  );
};

export default HomePage;
