import { HookProps } from '@/lib/parse-hook';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { Callout } from './callout';

export const getApiParamsTable = (groups: HookProps['apiParameters']) =>
  reactElementToJSXString(
    <div>
      {groups.map((group) => (
        <div key={group.id}>
          {group.parameters && (
            <div>
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
                      <TableCell>{'TODO'}</TableCell>
                      <TableCell>{parameter.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {group.returns && (
                <div>
                  <h4 className='text-l my-4 font-semibold'>Returns</h4>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

export const getWarning = (text?: string) =>
  text
    ? reactElementToJSXString(
        <Callout className='border-yellow-600 bg-yellow-100 dark:border-yellow-400 dark:bg-yellow-900'>
          **Important:** ${text}
        </Callout>
      )
    : '';
