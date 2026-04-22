import { createHash } from 'node:crypto';
import simpleGit from 'simple-git';

const git = simpleGit();

export const getContributors = async () => {
  try {
    const log = await git.log();
    const contributorsMap = new Map<string, { name: string; email: string; avatar: string }>();

    log.all.forEach((commit) => {
      const { author_email, author_name } = commit;
      if (author_email && !contributorsMap.has(author_name)) {
        contributorsMap.set(author_name, {
          name: author_name,
          email: author_email,
          avatar: `https://gravatar.com/avatar/${createHash('md5').update(author_email).digest('hex')}?d=retro`
        });
      }
    });

    const contributors = [...contributorsMap.values()].toSorted((a, b) =>
      a.name.localeCompare(b.name)
    );

    return contributors;
  } catch (error) {
    console.error('Failed to load contributors:', error);
    return [];
  }
};
