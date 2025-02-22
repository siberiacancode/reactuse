import { z } from 'zod';

export type PreferLanguage = 'js' | 'ts';

export interface HookRegistry {
  hookDependency: string[];
  localDependency: string[];
  name: string;
  utilsDependency: string[];
  urls: {
    js: string;
    ts: string;
  };
}

export const addOptionsSchema = z.object({
  hooks: z.array(z.string()).optional(),
  all: z.boolean()
});

export const configSchema = z
  .object({
    typescript: z.boolean(),
    hookPath: z.string(),
    utilsPath: z.string()
  })
  .strict();

export type AddOptionsSchema = z.infer<typeof addOptionsSchema>;
