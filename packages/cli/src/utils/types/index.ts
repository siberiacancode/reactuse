import * as z from 'zod';

export interface HookRegistry {
  hookDependency: string[];
  localDependency: string[];
  name: string;
  utilsDependency: string[];
}

export type PreferLanguage = 'js' | 'ts';

export const addOptionsSchema = z.object({
  hooks: z.array(z.string()).optional(),
  all: z.boolean()
});

export type AddOptionsSchema = z.infer<typeof addOptionsSchema>;


export const configSchema = z
  .object({
    typescript: z.boolean().optional(),
    hookPath: z.string(),
    utilsPath: z.string()
  })
  .strict();

export type ConfigSchema = z.infer<typeof configSchema>;
