import type { HookRegistry } from '@/utils/types';

const baseUrl =
  process.env.COMPONENTS_REGISTRY_URL ?? 'https://siberiacancode.github.io/reactuse/registry.json';

const getRegistry = async () => {
  try {
    const response = await fetch(baseUrl);

    const result = (await response.json()) as HookRegistry[];

    return result;
  } catch {
    throw new Error(`Failed to get registry from ${baseUrl}.`);
  }
};

export const getRegistryIndex = async () => {
  try {
    const result = await getRegistry();

    return result;
  } catch {
    throw new Error(`Failed to get hooks from registry.`);
  }
};
