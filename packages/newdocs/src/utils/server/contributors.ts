import { createHash } from 'node:crypto';
import simpleGit from 'simple-git';

const git = simpleGit();

export const getContributors = async () => {
  try {
    const log = await git.log();
    const contributorsMap = new Map<string, { name: string; email: string; avatar: string }>();

    log.all.forEach((commit) => {
      if (commit.author_email && !contributorsMap.has(commit.author_name)) {
        contributorsMap.set(commit.author_name, {
          name: commit.author_name,
          email: commit.author_email,
          avatar: `https://gravatar.com/avatar/${createHash('md5').update(commit.author_email).digest('hex')}?d=retro`
        });
      }
    });

    const contributors = [...contributorsMap.values()].toSorted((a, b) =>
      a.name.localeCompare(b.name)
    );

    return contributors;
  } catch {
    return [];
  }
};
