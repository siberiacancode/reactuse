import type { Spec } from 'comment-parser';
import type { HookProps } from './parse-hook';

import { parse } from 'comment-parser';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import simpleGit from 'simple-git';
import ts from 'typescript';

type ElementType = 'hooks' | 'helpers';
type ElementMeta = {
  apiParameters: Spec[];
  browserapi?: string;
  category?: string;
  description: string;
  examples: string[];
  hasDemo: boolean;
  hasTests: boolean;
  lastModified: number;
  name: string;
  contributors: NonNullable<HookProps['contributors']>;
  sourceExt: 'ts' | 'tsx';
  sourceCode: string;
  typeDeclarations?: string;
  type: 'helper' | 'hook';
  usage: string;
  warning?: string;
};

const ROOT = path.resolve(process.cwd(), '..');
const CORE_ROOT = path.join(ROOT, 'core', 'src');
const REPOSITORY_ROOT = path.resolve(ROOT, '..');
const git = simpleGit(REPOSITORY_ROOT);

const isElementType = (value: string): value is ElementType =>
  value === 'hooks' || value === 'helpers';

const toApiGroups = (apiParameters: Spec[]) => {
  const groups: { id: number; parameters: Spec[]; returns: Spec | null }[] = [];
  let current = { id: 0, parameters: [] as Spec[], returns: null as Spec | null };
  groups.push(current);

  const firstOverloadIndex = apiParameters.findIndex((parameter) => parameter.tag === 'overload');

  for (let i = 0; i < apiParameters.length; i += 1) {
    const parameter = apiParameters[i];

    if (parameter.tag === 'overload') {
      const isFirstOverload = i === firstOverloadIndex;
      if (!isFirstOverload) {
        current = { id: groups.length, parameters: [], returns: null };
        groups.push(current);
      }
      continue;
    }

    if (parameter.tag === 'returns') {
      current.returns = parameter;
      continue;
    }

    current.parameters.push(parameter);
  }

  return groups.filter((group) => group.parameters.length > 0 || group.returns);
};

const getElementDirs = async (type: ElementType) => {
  const sourceDir = path.join(CORE_ROOT, type);
  const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });

  return files.filter((file) => file.isDirectory()).map((file) => file.name);
};

const resolveElementName = async (type: ElementType, slug: string) => {
  const entries = await getElementDirs(type);
  return entries.find((entry) => entry.toLowerCase() === slug.toLowerCase()) ?? null;
};

const getElementSourceFile = async (type: ElementType, name: string) => {
  const dirPath = path.join(CORE_ROOT, type, name);
  const files = await fs.promises.readdir(dirPath);

  const fileName = files.find(
    (file) =>
      file.startsWith(name) &&
      (file.endsWith('.ts') || file.endsWith('.tsx')) &&
      !file.includes('.test') &&
      !file.includes('.demo') &&
      !file.includes('.d.ts')
  );

  if (!fileName) {
    return null;
  }

  return path.join(dirPath, fileName);
};

const createAvatarUrl = (email: string) =>
  `https://gravatar.com/avatar/${createHash('md5').update(email).digest('hex')}?d=retro`;

const extractTypeInfo = (sourceCode: string) => {
  const sourceFile = ts.createSourceFile('temp.ts', sourceCode, ts.ScriptTarget.Latest, true);
  const typeDeclarations: string[] = [];
  const typeImports: string[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      typeDeclarations.push(node.getText(sourceFile));
    }

    if (ts.isImportDeclaration(node)) {
      const isTypeOnly = node.importClause?.isTypeOnly;
      const hasTypeImports =
        node.importClause?.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings) &&
        node.importClause.namedBindings.elements.some((element) => element.isTypeOnly);

      if (isTypeOnly || hasTypeImports) {
        typeImports.push(node.getText(sourceFile));
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  const result = [...typeImports, ...typeDeclarations].join('\n\n');
  return result.length > 0 ? result : undefined;
};

const getElementMeta = async (typeRaw: ElementType, slug: string): Promise<ElementMeta | null> => {
  const name = await resolveElementName(typeRaw, slug);
  if (!name) {
    return null;
  }

  const sourcePath = await getElementSourceFile(typeRaw, name);
  if (!sourcePath) {
    return null;
  }

  const content = await fs.promises.readFile(sourcePath, 'utf-8');
  const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
  const matched = content.match(jsdocCommentRegex)?.[0]?.trim();
  if (!matched) {
    return null;
  }

  const parsed = parse(matched)[0];
  if (!parsed) {
    return null;
  }

  const description = parsed.tags.find(({ tag }) => tag === 'description');
  const examples = parsed.tags.filter(({ tag }) => tag === 'example');
  const usage = parsed.tags.find(({ tag }) => tag === 'usage');
  const category = parsed.tags.find(({ tag }) => tag === 'category');
  const warning = parsed.tags.find(({ tag }) => tag === 'warning');
  const browserapi = parsed.tags.find(({ tag }) => tag === 'browserapi');
  const apiParameters = parsed.tags.filter(
    ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns'
  );

  if (!description || examples.length === 0) {
    return null;
  }

  const dirPath = path.dirname(sourcePath);
  const hasTests =
    fs.existsSync(path.join(dirPath, `${name}.test.ts`)) ||
    fs.existsSync(path.join(dirPath, `${name}.test.tsx`));
  const hasDemo = fs.existsSync(path.join(dirPath, `${name}.demo.tsx`));
  const stat = await fs.promises.stat(sourcePath);
  const gitLog = await git.log({
    file: path.relative(REPOSITORY_ROOT, sourcePath).split(path.sep).join('/')
  });
  const contributors = Array.from(
    new Map(
      gitLog.all.map((commit) => [
        commit.author_email,
        {
          name: commit.author_name,
          email: commit.author_email
        }
      ])
    ).values(),
    (author) => ({
      name: author.name,
      avatar: createAvatarUrl(author.email)
    })
  );
  const lastModified = gitLog.latest?.date
    ? new Date(gitLog.latest.date).getTime()
    : stat.mtimeMs;

  return {
    name,
    type: typeRaw === 'hooks' ? 'hook' : 'helper',
    contributors,
    sourceExt: sourcePath.endsWith('.tsx') ? 'tsx' : 'ts',
    sourceCode: content,
    typeDeclarations: extractTypeInfo(content),
    description: description.description,
    examples: examples.map((example) => example.description),
    usage: usage?.name ?? 'low',
    category: category?.name?.toLowerCase() ?? (typeRaw === 'helpers' ? 'helpers' : 'utilities'),
    warning: warning?.description,
    browserapi: browserapi?.name,
    apiParameters,
    hasTests,
    hasDemo,
    lastModified
  };
};

export const getElementNames = async (type: ElementType) => getElementDirs(type);

export const getElements = async (type: ElementType) => {
  const names = await getElementDirs(type);
  const items = await Promise.all(names.map((name) => getElementDoc(type, name)));

  return items
    .filter((item): item is HookProps => item !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getElementNeighbours = async (typeRaw: string, slug: string) => {
  if (!isElementType(typeRaw)) {
    return { previous: null, next: null } as const;
  }

  const entries = (await getElementDirs(typeRaw)).sort((a, b) => a.localeCompare(b));
  const resolved = entries.find((entry) => entry.toLowerCase() === slug.toLowerCase());
  if (!resolved) {
    return { previous: null, next: null } as const;
  }

  const currentIndex = entries.findIndex((entry) => entry === resolved);
  const previousName = currentIndex > 0 ? entries[currentIndex - 1] : null;
  const nextName = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;

  return {
    previous: previousName
      ? { name: previousName, url: `/functions/${typeRaw}/${previousName}` }
      : null,
    next: nextName ? { name: nextName, url: `/functions/${typeRaw}/${nextName}` } : null
  } as const;
};

export const getElementStaticParams = async () => {
  const hooks = await getElementDirs('hooks');
  const helpers = await getElementDirs('helpers');

  const raw = [
    ...hooks.map((name) => ({ name, type: 'hooks' as const })),
    ...hooks.map((name) => ({ name: name.toLowerCase(), type: 'hooks' as const })),
    ...helpers.map((name) => ({ name, type: 'helpers' as const })),
    ...helpers.map((name) => ({ name: name.toLowerCase(), type: 'helpers' as const }))
  ];

  const unique = new Map<string, { name: string; type: 'hooks' | 'helpers' }>();
  for (const item of raw) {
    unique.set(`${item.type}:${item.name}`, item);
  }

  return Array.from(unique.values());
};

export const getElementDoc = async (typeRaw: string, slug: string): Promise<HookProps | null> => {
  if (!isElementType(typeRaw)) {
    return null;
  }

  const meta = await getElementMeta(typeRaw, slug);
  if (!meta) {
    return null;
  }

  return {
    ...meta,
    apiParameters: toApiGroups(meta.apiParameters)
  };
};

const toTitle = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const CATEGORY_ORDER = [
  'elements',
  'async',
  'lifecycle',
  'state',
  'browser',
  'sensors',
  'time',
  'user',
  'utilities',
  'debug',
  'helpers'
];

export const getFunctionsSidebarGroups = async () => {
  const hookNames = await getElementDirs('hooks');
  const helperNames = await getElementDirs('helpers');

  const hookEntries = (
    await Promise.all(
      hookNames.map(async (name) => {
        const meta = await getElementMeta('hooks', name);
        if (!meta) {
          return null;
        }

        return {
          category: meta.category ?? 'utilities',
          name: meta.name,
          url: `/functions/hooks/${meta.name}`
        };
      })
    )
  ).filter((item): item is { category: string; name: string; url: string } => item !== null);

  const groupedHooks = new Map<string, { name: string; url: string }[]>();

  for (const entry of hookEntries) {
    const current = groupedHooks.get(entry.category) ?? [];
    current.push({ name: entry.name, url: entry.url });
    groupedHooks.set(entry.category, current);
  }

  const hookGroups = Array.from(groupedHooks.entries())
    .map(([category, items]) => ({
      title: toTitle(category),
      order:
        CATEGORY_ORDER.indexOf(category) === -1
          ? Number.MAX_SAFE_INTEGER
          : CATEGORY_ORDER.indexOf(category),
      items: items.sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    })
    .map(({ title, items }) => ({ title, items }));

  const helperItems = helperNames
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, url: `/functions/helpers/${name}` }));

  return [...hookGroups, { title: 'Helpers', items: helperItems }];
};
