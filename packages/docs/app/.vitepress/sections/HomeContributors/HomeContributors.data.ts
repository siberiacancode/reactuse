import md5 from 'md5';
import { simpleGit } from 'simple-git';

const git = simpleGit();

export default {
  async load() {
    try {
      const log = await git.log();
      const contributorsMap = new Map();

      log.all.forEach((commit) => {
        const { author_email, author_name } = commit;
        if (author_email && !contributorsMap.has(author_name)) {
          contributorsMap.set(author_name, {
            name: author_name,
            email: author_email,
            avatar: `https://gravatar.com/avatar/${md5(author_email)}?d=retro`
          });
        }
      });

      const contributors = Array.from(contributorsMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return {
        contributors
      };
    } catch (error) {
      console.error('Failed to load contributors:', error);
      return { contributors: [] };
    }
  }
};
