import { docs, functions } from '@docs/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource()
});

export const functionsSource = loader({
  baseUrl: '/functions',
  source: functions.toFumadocsSource()
});
