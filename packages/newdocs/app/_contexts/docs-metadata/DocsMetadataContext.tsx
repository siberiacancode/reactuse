'use client';

import type { ReactNode } from 'react';

import { createContext, useContext } from 'react';

export interface DocsContributor {
  avatar: string;
  name: string;
}

export interface DocsFunctionElement {
  name: string;
  type: 'helper' | 'hook';
}

export interface DocsMetadata {
  contributors: DocsContributor[];
  helpers: DocsFunctionElement[];
  hooks: DocsFunctionElement[];
}

interface DocsMetadataProviderProps {
  children: ReactNode;
  metadata: DocsMetadata;
}

const DocsMetadataContext = createContext<DocsMetadata | null>(null);

export const DocsMetadataProvider = ({ children, metadata }: DocsMetadataProviderProps) => (
  <DocsMetadataContext.Provider value={metadata}>{children}</DocsMetadataContext.Provider>
);

export const useDocsMetadata = () => {
  const context = useContext(DocsMetadataContext);

  if (!context) {
    throw new Error('useDocsMetadata must be used inside DocsMetadataProvider');
  }

  return context;
};
