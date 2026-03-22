import fs, { existsSync } from 'fs';
import { parse, Spec } from 'comment-parser';
import path from 'path';
import simpleGit from 'simple-git';
import md5 from 'md5';

interface ApiParameters {
  id: number;
  parameters: Spec[];
  returns: Spec | null;
}
interface Contributor {
  name: string;
  avatar: string;
}

export type HookProps = {
  name: string;
  description?: string;
  examples: string[];
  usage?: string;
  category: string;
  hasTests: boolean;
  apiParameters: ApiParameters[];
  browserapi?: string;
  warning?: string;
  deprecated?: boolean;
  contributors: Contributor[];
};

const git = simpleGit();

const matchJsdoc = (file: string) => {
  const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
  const match = file.match(jsdocCommentRegex);
  return match ? match[0].trim() : undefined;
};

export const isHookPath = (name: string) =>
  name.startsWith('use') && !name.includes('.test.') && !name.endsWith('.demo.tsx');

const createGroup = (id: number): ApiParameters => ({
  id,
  parameters: [],
  returns: null
});

function getApiParams(apiParameters: Spec[]) {
  if (!Array.isArray(apiParameters) || apiParameters.length === 0) {
    return [];
  }

  const groups: ApiParameters[] = [];
  let currentGroup: ApiParameters = createGroup(0);
  groups.push(currentGroup);

  const firstOverloadIndex = apiParameters.findIndex((p) => p.tag === 'overload');

  for (let i = 0; i < apiParameters.length; i++) {
    const parameter = apiParameters[i];

    if (parameter.tag === 'overload') {
      const isFirstOverload = i === firstOverloadIndex;

      if (!isFirstOverload) {
        currentGroup = createGroup(groups.length);
        groups.push(currentGroup);
      }

      continue;
    }

    if (parameter.tag === 'returns') {
      currentGroup.returns = parameter;
      continue;
    }

    currentGroup.parameters.push(parameter);
  }

  return groups.filter((group) => group.parameters.length > 0);
}

//TODO: type
export const parseHookJsdocFromFile = async (file: string): Promise<any> => {
  const name = path.basename(file, path.extname(file));
  const dir = path.dirname(file);

  const hasTests =
    existsSync(path.join(dir, name + '.test.ts')) || existsSync(path.join(dir, name + '.test.tsx'));

  const fileContent = fs.readFileSync(file, 'utf-8');
  const jsdoc = matchJsdoc(fileContent);

  if (!jsdoc) {
    return;
  }

  const gitLogs = await git.log({
    file: `../core/src/hooks/${name}/${name}.ts`
  });

  const contributors = Array.from(
    new Map(
      gitLogs.all.map((commit) => [
        commit.author_email,
        { name: commit.author_name, email: commit.author_email }
      ])
    ).values()
  ).map((author) => ({
    name: author.name,
    avatar: `https://gravatar.com/avatar/${md5(author.email)}?d=retro`
  }));

  const lastModified = new Date(gitLogs.latest?.date ?? Date.now()).getTime();

  const _jsdoc = parse(jsdoc)[0];

  const description = _jsdoc.tags.find(({ tag }) => tag === 'description');
  const examples = _jsdoc.tags.filter(({ tag }) => tag === 'example');
  const usage = _jsdoc.tags.find(({ tag }) => tag === 'usage');
  const deprecated = _jsdoc.tags.find(({ tag }) => tag === 'deprecated');
  const category = _jsdoc.tags.find(({ tag }) => tag === 'category');
  const warning = _jsdoc.tags.find(({ tag }) => tag === 'warning');
  const browserapi = _jsdoc.tags.find(({ tag }) => tag === 'browserapi');
  const apiParameters = getApiParams(
    _jsdoc.tags.filter(({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns')
  );

  return {
    description: description?.description,
    examples: examples.map((example) => example.description),
    usage: usage?.name,
    apiParameters: apiParameters || [],
    deprecated: deprecated?.name,
    category: category?.name?.toLowerCase(),
    browserapi: browserapi?.name,
    warning: warning?.description,
    hasTests,
    contributors,
    lastModified
  };
};
