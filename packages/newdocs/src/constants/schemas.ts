import { z } from 'zod';

export const usageSchema = z.enum(['low', 'medium', 'high', 'necessary']);
export const categorySchema = z.enum([
  'async',
  'browser',
  'time',
  'elements',
  'humor',
  'state',
  'debug',
  'sensors',
  'lifecycle',
  'utilities',
  'user'
]);
export const typeSchema = z.enum(['hook', 'helper']);

export type Usage = z.infer<typeof usageSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Type = z.infer<typeof typeSchema>;

export type FunctionType = 'helper' | 'hook';
export type CodeLanguage = 'js' | 'jsx' | 'ts' | 'tsx';

export interface FunctionApiParameter {
  default?: string;
  description: string;
  name: string;
  optional?: boolean;
  tag: string;
  type: string;
}

export interface FunctionContributor {
  avatar: string;
  name: string;
}

export interface FunctionMetadata {
  apiParameters: FunctionApiParameter[];
  browserapi?: {
    name: string;
    description: string;
  };
  category: string;
  code: string;
  contributors: FunctionContributor[];
  demo: string;
  dependencies: {
    hooks: string[];
    utils: string[];
    packages: string[];
  };
  description: string;
  examples: string[];
  id: string;
  isTest: boolean;
  jsImplementation?: string;
  lastModified: number;
  name: string;
  type: FunctionType;
  typeDeclarations: string;
  usage: string;
  warning?: string;
}
