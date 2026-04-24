import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';

interface FunctionContributorsProps {
  contributors: {
    name: string;
    avatar: string;
  }[];
}

export const FunctionContributors = (props: FunctionContributorsProps) => (
  <div className='my-4 flex flex-wrap gap-4'>
    {(props.contributors ?? []).map(({ name, avatar }) => (
      <div key={name} className='flex gap-2'>
        <Avatar>
          <AvatarImage alt={name} src={avatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className='mt-1 leading-7'>{name}</h3>
      </div>
    ))}
  </div>
);
