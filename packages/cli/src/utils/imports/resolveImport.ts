import type { ConfigLoaderSuccessResult } from 'tsconfig-paths';

import { createMatchPath } from 'tsconfig-paths';

export const resolveImport = async (
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, 'absoluteBaseUrl' | 'paths'>
) => createMatchPath(config.absoluteBaseUrl, config.paths)(importPath, undefined, () => true, [
  '.ts',
  '.tsx'
]);
