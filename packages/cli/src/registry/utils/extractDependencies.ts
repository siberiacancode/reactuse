export const extractDependencies = (content: string) => {
  const hooks = new Set<string>();
  const utils = new Set<string>();
  const packages = new Set<string>();

  const hookMatches = Array.from(
    content.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*use[^'"]*)['"]/g)
  );
  for (const match of hookMatches) {
    const imports = match[1].split(',').map((item) => item.trim());
    for (const item of imports) {
      if (item.startsWith('use') && /^[a-z]/.test(item)) hooks.add(item);
    }
  }

  const utilsMatches = Array.from(
    content.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"](@\/utils[^'"]*)['"]/g)
  );
  for (const match of utilsMatches) {
    const imports = match[1].split(',').map((item) => item.trim());
    for (const item of imports) {
      if (item) utils.add(item);
    }
  }

  const packageMatches = Array.from(
    content.matchAll(/import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)(?<!\.\/.*)['"]/g)
  );
  for (const match of packageMatches) {
    const packageName = match[3];
    if (
      packageName &&
      !['react', 'react-dom'].includes(packageName) &&
      !packageName.startsWith('@/')
    ) {
      packages.add(packageName);
    }
  }

  return {
    hooks: Array.from(hooks),
    utils: Array.from(utils),
    packages: Array.from(packages)
  };
};
