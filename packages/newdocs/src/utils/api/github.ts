import fetches from '@siberiacancode/fetches';

const GITHUB_REPOSITORY_API = 'https://api.github.com/repos/siberiacancode/reactuse';

export interface GitHubRepository {
  stargazers_count: number;
}

export interface GitHubRelease {
  body: string;
  html_url: string;
  name?: string;
  tag_name: string;
}

export const getRepository = async () =>
  await fetches.get<GitHubRepository>(GITHUB_REPOSITORY_API, {
    cache: 'force-cache'
  });

export const getLatestReleases = async () =>
  await fetches.get<GitHubRelease[]>(`${GITHUB_REPOSITORY_API}/releases?per_page=1`, {
    cache: 'force-cache'
  });
