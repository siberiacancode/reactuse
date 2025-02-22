import { z } from 'zod';

export interface HookRegistry {
  hookDependency: string[];
  localDependency: string[];
  name: string;
  utilsDependency: string[];
}

export const addOptionsSchema = z.object({
  hooks: z.array(z.string()).optional(),
  all: z.boolean()
});

export const configSchema = z
  .object({
    hookPath: z.string(),
    utilsPath: z.string()
  })
  .strict();

export type AddOptionsSchema = z.infer<typeof addOptionsSchema>;
