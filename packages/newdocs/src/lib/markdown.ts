import type { ShikiTransformer } from 'shiki';

import convert from 'npm-to-yarn';
import { visit } from 'unist-util-visit';

export const transformers = [
  {
    code(node) {
      if (node.tagName === 'code') {
        const raw = this.source;
        node.properties.__raw__ = raw;
        const isPackagesInstall =
          raw.startsWith('npm') ||
          raw.startsWith('yarn') ||
          raw.startsWith('pnpm') ||
          raw.startsWith('npx') ||
          raw.startsWith('bun');
        node.properties.__copy__ = isPackagesInstall ? 'not-copy' : 'copy';
      }
    }
  }
] as ShikiTransformer[];

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const remarkPackageInstall = () => (tree: any) => {
  visit(tree, 'code', (node, index, parent) => {
    if (node.lang !== 'packages-install' || !parent) return;

    const command = node.value.trim();

    if (!command.startsWith('npm ') && !command.startsWith('npx ')) {
      throw new Error(`package-install block must start with "npm" or "npx":\n${command}`);
    }

    const createCommand = (command: string, manager: PackageManager) => {
      if (manager === 'npm') return command;
      const converted = convert(command, manager);
      return converted;
    };

    parent.children[index!] = {
      type: 'mdxJsxFlowElement',
      name: 'PackageManagerTabs',
      attributes: [],
      children: PACKAGE_MANAGERS.map((manager) => ({
        type: 'mdxJsxFlowElement',
        name: 'PackageManagerTab',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'value',
            value: manager
          }
        ],
        children: [
          {
            type: 'code',
            lang: 'bash',
            meta: 'no-copy',
            value: createCommand(command, manager)
          }
        ]
      }))
    };
  });
};
