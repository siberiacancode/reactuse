import type { HookRegistry } from '@/utils/types';

const BASE_URL =
  process.env.COMPONENTS_REGISTRY_URL ?? 'https://siberiacancode.github.io/reactuse/registry.json';
export const getRegistry = () =>
  fetch(BASE_URL).then((response) => response.json()) as Promise<HookRegistry[]>;
