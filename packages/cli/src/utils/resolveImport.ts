import { type ConfigLoaderSuccessResult, createMatchPath } from 'tsconfig-paths';

// eslint-disable-next-line @typescript-eslint/require-await
export async function resolveImport(
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, 'absoluteBaseUrl' | 'paths'>
) {
  return createMatchPath(config.absoluteBaseUrl, config.paths)(importPath, undefined, () => true, [
    '.ts',
    '.tsx'
  ]);
}
