import type { FunctionContributor } from '@/src/utils/constants';

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';

interface FunctionContributorsProps {
  contributors: FunctionContributor[];
}

export const FunctionContributors = (props: FunctionContributorsProps) => (
  <div className='my-4 flex flex-wrap gap-4'>
    {props.contributors.map(({ name, avatar }) => (
      <Badge key={name} className='flex items-center gap-2' variant='outline'>
        <Avatar>
          <AvatarImage alt={name} src={avatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className='text-lg'>{name}</span>
      </Badge>
    ))}
  </div>
);
