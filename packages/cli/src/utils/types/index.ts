import * as z from 'zod';

export interface HookRegistry {
  hooks: string[];
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
  registry: z.string(),
  overwrite: z.boolean(),
  cwd: z.string()
});

export type AddOptionsSchema = z.infer<typeof addOptionsSchema>;

export const configSchema = z
  .object({
    ts: z.boolean().optional(),
    alias: z.object({
      hooks: z.string(),
      utils: z.string()
    })
  })
  .strict();

export type ConfigSchema = z.infer<typeof configSchema>;
