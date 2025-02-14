import { promises as fs } from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';
import { z } from 'zod';

export const configSchema = z
  .object({
    hookPath: z.string(),
    utilsPath: z.string()
  })
  .strict();

export const promptForConfig = async (cwd: string) => {
  const options = await prompts([
    {
      type: 'text',
      name: 'reactuseConfig',
      message: `Where is your reactuse.config.json will be located?`,
      initial: `reactuse.config.json`
    },
    {
      type: 'text',
      name: 'hooksLocated',
      message: `Configure the import alias for hooks`,
      initial: `@/shared/hooks`
    },
    {
      type: 'text',
      name: 'utilsLocated',
      message: `Configure the import alias for utils`,
      initial: `@/utils/helpers`
    }
  ]);

  const config = configSchema.parse({
    hookPath: options.hooksLocated,
    utilsPath: options.utilsLocated
  });

  const targetPath = path.resolve(cwd, `reactuse.config.json`);

  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), 'utf8');
};
