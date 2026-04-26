import path from 'node:path';
import process from 'node:process';

export const CORE_ROOT = path.join(process.cwd(), '..', 'core', 'src');
export const CONTENT_ROOT = path.join(process.cwd(), 'content');
export const PUBLIC_ROOT = path.join(process.cwd(), 'public');
