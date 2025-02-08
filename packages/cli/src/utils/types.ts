import { z } from 'zod';

export interface RegistryList {
  hookDependency: string[];
  name: string;
  utilsDependency: string[];
}

export const addOptionsSchema = z.object({
  hooks: z.array(z.string()).optional(),
  all: z.boolean(),
  cwd: z.string().optional()
});

export const initOptionsSchema = z.object({
  cwd: z.string().optional()
});

export type AddOptionsSchema = z.infer<typeof addOptionsSchema>;

export type InitOptionsSchema = z.infer<typeof initOptionsSchema>;
