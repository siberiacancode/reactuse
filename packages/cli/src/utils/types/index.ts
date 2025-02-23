import * as z from 'zod';

export interface HookRegistry {
  hooks: string[];
  local: string[];
  name: string;
  packages: string[];
  utils: string[];
}

export interface Registry {
  [key: string]: HookRegistry;
}

export const addOptionsSchema = z.object({
  hooks: z.array(z.string()),
  all: z.boolean(),
  registry: z.string()
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
