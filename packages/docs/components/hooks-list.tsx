import type {PageTreeFolder} from '@docs/lib/page-tree';

import { getPagesFromFolder  } from '@docs/lib/page-tree';
import Link from 'next/link';

export const HooksList = ({
  componentsFolder,
  currentBase
}: {
  componentsFolder: PageTreeFolder;
  currentBase: string;
}) => {
  const list = getPagesFromFolder(componentsFolder, currentBase);

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20'>
      {list.map((component) => (
        <Link
          key={component.$id}
          className='inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base'
          href={component.url}
        >
          {component.name}
        </Link>
      ))}
    </div>
  );
}
