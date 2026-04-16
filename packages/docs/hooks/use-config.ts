import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface Config {
  installationType: 'cli' | 'manual';
  packageManager: 'bun' | 'npm' | 'pnpm' | 'yarn';
}

const configAtom = atomWithStorage<Config>('config', {
  packageManager: 'pnpm',
  installationType: 'cli'
});

export function useConfig() {
  return useAtom(configAtom);
}
