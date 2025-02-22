import fs from 'node:fs';

export const isRegistryFileExist = (registryPath: string) => {
  if (!fs.existsSync(registryPath)) return false;

  const fileContent = fs.readFileSync(registryPath, 'utf-8');
  if (!fileContent.trim()) return false;

  return true;
};
