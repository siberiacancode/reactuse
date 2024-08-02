import { promises as fs } from 'fs';
import path from 'path';
import prompts from 'prompts';
import { z } from 'zod';

export const configSchema = z
  .object({
    hookPath: z.string()
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
      message: `Where will hook be loaded?`,
      initial: `src/shared/hooks`
    },
    {
      type: 'text',
      name: 'utilsLocated',
      message: `Where will utils be loaded?`,
      initial: `src/shared/utils`
    }
  ]);

  const config = configSchema.parse({
    hookPath: options.hooksLocated
  });

  const targetPath = path.resolve(cwd, `reactuse.config.json`);

  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), 'utf8');
};
