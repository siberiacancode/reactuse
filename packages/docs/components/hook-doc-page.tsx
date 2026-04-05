import { Callout } from './callout';
import { Badge } from '../ui/badge';
import { HookProps } from '@docs/lib/parse-hook';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { timeAgo } from '@docs/lib/utils';
import { Code } from './code';


export const DocHeader = (props: HookProps) => (
  <>
    <div>
      <div className='flex gap-3'>
        <Badge className='bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'>
          {props.category}
        </Badge>
        <Badge className='bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'>
          {props.usage}
        </Badge>
        <Badge
          className={
            props.hasTests
              ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          }
        >
          test coverage
        </Badge>
      </div>
      <p className='mt-4 leading-7'>Last changed: {timeAgo(props.lastModified)}</p>
    </div>

    {props.warning && (
      <Callout className='border-yellow-600 bg-yellow-100 dark:border-yellow-400 dark:bg-yellow-900'>
        <h4 className='text-l font-semibold'>Important</h4>
        {props.warning}
      </Callout>
    )}

    {props.browserapi && (
      <Callout className='border-blue-600 bg-blue-100 dark:border-blue-400 dark:bg-blue-900'>
        <h4 className='text-l font-semibold'>TIP</h4>
        This hook uses {props.browserapi} browser api to provide enhanced functionality. Make sure
        to check for compatibility with different browsers when using this api
      </Callout>
    )}
  </>
);

export const DocUsageExamples = (props: HookProps) =>
  props.examples.map((example) => <Code key={example} code={example} />);

export const DocContributors = (props: HookProps) => (
  <div className='my-4 flex flex-wrap gap-4'>
    {props.contributors.map(({ name, avatar }) => (
      <div key={name} className='flex gap-2'>
        <Avatar>
          <AvatarImage src={avatar} alt='@shadcn' />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <h3 className='mt-1 leading-7'>{name}</h3>
      </div>
    ))}
  </div>
);

export const DocTableApi = (props: HookProps) =>
  props.apiParameters.map((group) => (
    <div key={group.id}>
      <>
        {group.parameters.length > 0 && (
          <>
            <h4 className='text-l my-4 font-semibold'>Parameters</h4>
            <Table className='mb-4'>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.parameters.map((parameter) => (
                  <TableRow key={parameter.name}>
                    <TableCell>
                      {parameter.name}
                      {parameter.optional ? '?' : ''}
                    </TableCell>
                    <TableCell>{parameter.type}</TableCell>
                    <TableCell>{parameter.default ?? '-'}</TableCell>
                    <TableCell>{parameter.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
        {group.returns && (
          <>
            <h4 className='text-l my-4 font-semibold'>Return</h4>
            <Badge className='bg-blue-50 text-blue-400 dark:bg-blue-950 dark:text-blue-300'>
              {group.returns.type}
            </Badge>
          </>
        )}
      </>
    </div>
  ));
