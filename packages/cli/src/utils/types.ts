import { z } from 'zod';

export interface HookList {
  download_url: string;
  git_url: string;
  html_url: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'dir' | 'file';
  url: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
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
