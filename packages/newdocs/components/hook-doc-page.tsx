import type { HookProps } from '@docs/lib/parse-hook';
import type { JSX } from 'react';

import { timeAgo } from '@docs/lib/utils';
import {
  IconBug,
  IconCube,
  IconFlame,
  IconHelpCircle,
  IconHorseToy,
  IconLoader,
  IconPictureInPictureOff,
  IconRecycle,
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckOff,
  IconTelescope,
  IconTools,
  IconUser,
  IconWorld
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Callout } from './callout';
import { Code } from './code';

const categoryMap: Record<string, { icon: JSX.Element; className: string }> = {
  browser: {
    icon: <IconWorld />,
    className: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
  },
  elements: {
    icon: <IconPictureInPictureOff />,
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
  },
  state: {
    icon: <IconCube />,
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
  },
  sensors: {
    icon: <IconTelescope />,
    className: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300'
  },
  humor: {
    icon: <IconHorseToy />,
    className: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
  },
  debug: {
    icon: <IconBug />,
    className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
  },
  helpers: {
    icon: <IconHelpCircle />,
    className: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
  },
  lifecycle: {
    icon: <IconRecycle />,
    className: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
  },
  utilities: {
    icon: <IconTools />,
    className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
  },
  async: {
    icon: <IconLoader />,
    className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
  },
  user: {
    icon: <IconUser />,
    className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
  }
};

const usageMap: Record<string, string> = {
  low: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  medium: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  high: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  necessary: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
};

export const DocHeader = (props: HookProps) => {
  const categoryMeta = categoryMap[props.category] ?? {};

  return (
    <>
      <div>
        <div className='flex gap-3'>
          <Badge
            className={
              categoryMeta.className ??
              'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            }
          >
            {categoryMeta && categoryMeta.icon}
            {props.category}
          </Badge>
          <Badge
            className={
              props.usage
                ? usageMap[props.usage]
                : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
            }
          >
            <IconFlame />
            {props.usage}
          </Badge>
          <Badge
            className={
              props.hasTests
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
            }
          >
            {props.hasTests ? <IconRosetteDiscountCheck /> : <IconRosetteDiscountCheckOff />} test
            coverage
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
};

export const DocUsageExamples = (props: HookProps) =>
  props.examples.map((example) => <Code key={example} code={example} />);

export const DocContributors = (props: HookProps) => (
  <div className='my-4 flex flex-wrap gap-4'>
    {props.contributors.map(({ name, avatar }) => (
      <div key={name} className='flex gap-2'>
        <Avatar>
          <AvatarImage alt='@shadcn' src={avatar} />
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
