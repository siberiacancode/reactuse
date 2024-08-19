import { pathExists } from 'fs-extra';
import path from 'path';

export function isTypeScriptProject(cwd: string): Promise<boolean> {
  return pathExists(path.resolve(cwd, 'tsconfig.json'));
}
