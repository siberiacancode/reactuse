import type { HookRegistry } from '@/utils/types';

const baseUrl =
  process.env.COMPONENTS_REGISTRY_URL ?? 'https://siberiacancode.github.io/reactuse/registry.json';

const fetchRegistry = async () => {
  try {
    const response = await fetch(baseUrl);

    const result = (await response.json()) as HookRegistry[];

    return result;
  } catch {
    throw new Error(`Failed to fetch registry from ${baseUrl}.`);
  }
};

export const getRegistryIndex = async () => {
  try {
    const result = await fetchRegistry();

    return result;
  } catch {
    throw new Error(`Failed to fetch hooks from registry.`);
  }
};
