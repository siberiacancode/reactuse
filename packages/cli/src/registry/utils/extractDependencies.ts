import { FETCH_REPO_URL_TS } from '@/utils/constants';

export const extractDependencies = (content: string) => {
  const hookImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*use[^'"]*)['"]/g;
  const utilsImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"](@\/utils[^'"]*)['"]/g;
  const localImportRegex = /(?:import|export).*?from\s+['"]\.\/helpers\/([^'"]+)['"]/g;

  const hooks = new Set<string>();
  const utils = new Set<string>();
  const locals = new Set<string>();

  let match;

  while ((match = hookImportRegex.exec(content)) !== null) {
    match[1]
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.startsWith('use') && /^[a-z]/.test(item))
      .forEach((item) => hooks.add(item));
  }

  while ((match = utilsImportRegex.exec(content)) !== null) {
    match[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => utils.add(item));
  }

  while ((match = localImportRegex.exec(content)) !== null) {
    const fileName = match[1].split('/').pop()!;
    locals.add(fileName);
  }

  return {
    hookDependency: Array.from(hooks),
    utilsDependency: Array.from(utils),
    localDependency: Array.from(locals)
  };
};

export const extractUrls = (hook: string) => {
  const ts = `${FETCH_REPO_URL_TS}/hooks/${hook}/${hook}.ts`;
  const js = `${FETCH_REPO_URL_TS}/bundle/hooks/${hook}/${hook}.js`;

  return {
    js,
    ts
  };
};
