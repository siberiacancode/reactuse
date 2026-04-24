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
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  elements: {
    icon: <IconPictureInPictureOff />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  state: {
    icon: <IconCube />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  sensors: {
    icon: <IconTelescope />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  humor: {
    icon: <IconHorseToy />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  debug: {
    icon: <IconBug />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  helpers: {
    icon: <IconHelpCircle />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  lifecycle: {
    icon: <IconRecycle />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  utilities: {
    icon: <IconTools />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  async: {
    icon: <IconLoader />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  user: {
    icon: <IconUser />,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  }
};

const usageMap: Record<string, string> = {
  low: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
  medium: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
  high: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
  necessary: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
};

export const DocHeader = (props: HookProps) => {
  const categoryKey = props.category ?? 'utilities';
  const categoryMeta = categoryMap[categoryKey] ?? {};
  const badgeBaseClass =
    'border-0 px-3 py-1 text-sm font-medium shadow-none [&_svg]:size-3.5 [&_svg]:opacity-80';

  return (
    <>
      <div>
        <div className='flex gap-3'>
          <Badge
            className={`${badgeBaseClass} ${
              categoryMeta.className ??
              'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
            }`}
          >
            {categoryMeta && categoryMeta.icon}
            {categoryKey}
          </Badge>
          <Badge
            className={`${badgeBaseClass} ${
              props.usage
                ? usageMap[props.usage]
                : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
            }`}
          >
            <IconFlame />
            {props.usage}
          </Badge>
          <Badge
            className={`${badgeBaseClass} ${
              props.hasTests
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
            }`}
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
    {(props.contributors ?? []).map(({ name, avatar }) => (
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
