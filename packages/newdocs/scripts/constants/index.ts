import path from 'node:path';
import process from 'node:process';

export type FunctionType = 'helper' | 'hook';
export interface FunctionMetadata {
  apiParameters: any[];
  browserapi?: {
    name: string;
    description: string;
  };
  category: string;
  code: string;
  description: string;
  examples: string[];
  id: string;
  isDemo: boolean;
  isTest: boolean;
  jsImplementation?: string;
  lastModified: number;
  name: string;
  type: FunctionType;
  usage: string;
}

export const CORE_ROOT = path.join(process.cwd(), '..', 'core', 'src');
export const CONTENT_ROOT = path.join(process.cwd(), 'content');
export const PUBLIC_ROOT = path.join(process.cwd(), 'public');
