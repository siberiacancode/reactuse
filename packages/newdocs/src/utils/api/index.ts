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

export const getRepository = () => fetches.get<GitHubRepository>(GITHUB_REPOSITORY_API);
export const getLatestReleases = () =>
  fetches.get<GitHubRelease[]>(`${GITHUB_REPOSITORY_API}/releases?per_page=1`);

interface NpmDownloadsResponse {
  downloads: number;
}

export const getNpmDownloads = () =>
  fetches.get<NpmDownloadsResponse>(
    `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent('@siberiacancode/reactuse')}`
  );
