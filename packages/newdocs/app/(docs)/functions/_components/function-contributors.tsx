import type { FunctionContributor } from '@/src/constants';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';

interface FunctionContributorsProps {
  contributors: FunctionContributor[];
}

export const FunctionContributors = (props: FunctionContributorsProps) => (
  <div className='my-4 flex flex-wrap gap-4'>
    {props.contributors.map(({ name, avatar }) => (
      <Badge key={name} className='h-8 gap-2 rounded-full px-2 py-0 pl-1' variant='outline'>
        <Avatar size='sm'>
          <AvatarImage alt={name} src={avatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className='text-sm'>{name}</span>
      </Badge>
    ))}
  </div>
);
