import { createHash } from 'node:crypto';
import path from 'node:path';
import simpleGit from 'simple-git';

import type { FunctionType } from '@/src/constants';

import { CORE_ROOT } from '../constants';

const git = simpleGit();
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const NEW_DAYS_THRESHOLD = 30;

export const getGitInfo = async (name: string, type: FunctionType, extension: string) => {
  const filePath = path.join(CORE_ROOT, `${type}s`, name, `${name}.${extension}`);

  const log = await git.log({
    file: path.relative(process.cwd(), filePath)
  });
  const commits = log.all;
  const lastCommit = log.latest!;
  const firstCommit = commits.at(-1)!;
  const now = Date.now();
  const firstCommitAt = new Date(firstCommit.date).getTime();
  const isNew = now - firstCommitAt <= NEW_DAYS_THRESHOLD * DAY_IN_MS;

  const contributorsMap = new Map(
    commits.map((commit) => [
      commit.author_email,
      { name: commit.author_name, email: commit.author_email }
    ])
  );

  const contributors = Array.from(contributorsMap.values(), (author) => ({
    name: author.name,
    avatar: `https://gravatar.com/avatar/${createHash('md5').update(author.email).digest('hex')}?d=retro`
  }));

  return {
    firstCommit,
    contributors,
    isNew,
    lastCommit
  };
};
