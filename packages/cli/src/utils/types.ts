import { z } from 'zod';

export interface HookList {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: 'dir' | 'file';
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
