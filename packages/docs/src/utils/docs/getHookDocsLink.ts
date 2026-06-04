import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SITE_ORIGIN = 'https://reactuse.org';

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

export interface HookDocsNavigation {
  link: string;
  rel?: string;
  target?: string;
}

export const getHookDocsLink = async (name: string): Promise<HookDocsNavigation> => {
  const migratedHookNames = await getMigratedHookNames();

  if (migratedHookNames.has(name)) {
    return {
      link: `${SITE_ORIGIN}/new/functions/hooks/${name}`,
      rel: 'noreferrer',
      target: '_self'
    };
  }

  return {
    link: `/functions/hooks/${name}`
  };
};
