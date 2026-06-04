import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

let migratedHookNamesPromise: Promise<Set<string>> | null = null;

const getMigratedHookNames = async () => {
  if (!migratedHookNamesPromise) {
    migratedHookNamesPromise = readdir(
      path.resolve(process.cwd(), '../newdocs/public/functions/hooks'),
      { withFileTypes: true }
    ).then(
      (entries) =>
        new Set(
          entries
            .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
            .map((entry) => entry.name.slice(0, -'.md'.length))
        )
    );
  }

  return migratedHookNamesPromise;
};

export const getHookDocsLink = async (name: string) => {
  const migratedHookNames = await getMigratedHookNames();

  if (migratedHookNames.has(name)) {
    return `/new/functions/hooks/${name}`;
  }

  return `/functions/hooks/${name}`;
};
