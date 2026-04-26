import type { FunctionApiParameter } from '@/src/utils/constants';

import { MARKDOWN_COMPONENTS } from '@/src/components';
import { Separator } from '@/ui/separator';

interface FunctionApiProps {
  apiParameters: FunctionApiParameter[];
}

export const DEFAULT_TYPES = [
  'string',
  'number',
  'bigint',
  'boolean',
  'symbol',
  'undefined',
  'object',
  'function',
  'null',
  'array',
  'map',
  'set',
  'weakset',
  'weakmap',
  'error',
  'date'
];

export const isDefaultType = (type: string) => DEFAULT_TYPES.includes(type);

export const FunctionApi = ({ apiParameters }: FunctionApiProps) => {
  let groupIndex = 0;
  const groups: {
    id: number;
    parameters: FunctionApiParameter[];
    returns: FunctionApiParameter | null;
  }[] = [{ id: groupIndex, parameters: [], returns: null }];

  apiParameters.forEach((parameter, index) => {
    if (parameter.tag === 'overload') {
      const isFirstOverload = apiParameters.findIndex(({ tag }) => tag === 'overload') === index;

      if (!isFirstOverload) {
        groupIndex++;
        groups.push({ id: groupIndex, parameters: [], returns: null });
      }

      return;
    }

    if (parameter.tag === 'returns') {
      groups[groupIndex]!.returns = parameter;
      return;
    }

    groups[groupIndex]!.parameters.push(parameter);
  });

  return (
    <div className='flex flex-col gap-8'>
      {groups.map((group, index) => (
        <div key={group.id} className='flex flex-col gap-6'>
          {!!group.parameters.length && (
            <div className='flex flex-col gap-2'>
              <MARKDOWN_COMPONENTS.h3 className='mt-0'>Parameters</MARKDOWN_COMPONENTS.h3>

              <MARKDOWN_COMPONENTS.table>
                <MARKDOWN_COMPONENTS.thead>
                  <MARKDOWN_COMPONENTS.tr>
                    <MARKDOWN_COMPONENTS.th>Name</MARKDOWN_COMPONENTS.th>
                    <MARKDOWN_COMPONENTS.th>Type</MARKDOWN_COMPONENTS.th>
                    <MARKDOWN_COMPONENTS.th>Default</MARKDOWN_COMPONENTS.th>
                    <MARKDOWN_COMPONENTS.th>Note</MARKDOWN_COMPONENTS.th>
                  </MARKDOWN_COMPONENTS.tr>
                </MARKDOWN_COMPONENTS.thead>
                <MARKDOWN_COMPONENTS.tbody>
                  {group.parameters.map((parameter) => (
                    <MARKDOWN_COMPONENTS.tr key={parameter.name} className='m-0 border-b'>
                      <MARKDOWN_COMPONENTS.td>{parameter.name}</MARKDOWN_COMPONENTS.td>
                      <MARKDOWN_COMPONENTS.td>
                        {isDefaultType(parameter.type) ? (
                          parameter.type
                        ) : (
                          <code className='text-[var(--brand-hex)]'>{parameter.type}</code>
                        )}
                      </MARKDOWN_COMPONENTS.td>
                      <MARKDOWN_COMPONENTS.td>{parameter.default ?? '-'}</MARKDOWN_COMPONENTS.td>
                      <MARKDOWN_COMPONENTS.td>{parameter.description}</MARKDOWN_COMPONENTS.td>
                    </MARKDOWN_COMPONENTS.tr>
                  ))}
                </MARKDOWN_COMPONENTS.tbody>
              </MARKDOWN_COMPONENTS.table>
            </div>
          )}

          {!!group.returns && (
            <div className='flex flex-col gap-2'>
              <MARKDOWN_COMPONENTS.h3 className='mt-0'>Returns</MARKDOWN_COMPONENTS.h3>
              <code className='text-sm text-[var(--brand-hex)]'>{group.returns.type}</code>
            </div>
          )}

          {index < groups.length - 1 && <Separator className='my-1' />}
        </div>
      ))}
    </div>
  );
};
