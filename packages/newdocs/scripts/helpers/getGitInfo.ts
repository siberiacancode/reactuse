import { createHash } from 'node:crypto';
import path from 'node:path';
import simpleGit from 'simple-git';

import type { FunctionType } from '../constants';

import { CORE_ROOT } from '../constants';

const git = simpleGit();

export const getGitInfo = async (name: string, type: FunctionType) => {
  const log = await git.log({
    file: path.join(CORE_ROOT, `${type}s`, name, `${name}.ts`)
  });

  const contributorsMap = new Map(
    log.all.map((commit) => [
      commit.author_email,
      { name: commit.author_name, email: commit.author_email }
    ])
  );

  const contributors = Array.from(contributorsMap.values(), (author) => ({
    name: author.name,
    avatar: `https://gravatar.com/avatar/${createHash('md5').update(author.email).digest('hex')}?d=retro`
  }));

  return {
    contributors,
    lastCommit: log.latest!
  };
};
