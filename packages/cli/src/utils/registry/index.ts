import type { RegistryList } from '@/utils/types';

const baseUrl = 'http://localhost:5173/reactuse/registry.json';

const fetchRegistry = async () => {
  try {
    const response = await fetch(baseUrl);

    const result = (await response.json()) as RegistryList[];

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
