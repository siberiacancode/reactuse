interface ApiParameter {
  default?: string;
  description: string;
  name: string;
  optional?: boolean;
  tag: (string & {}) | 'overload' | 'param' | 'returns';
  type: string;
}

interface FunctionApiProps {
  apiParameters: ApiParameter[];
}

interface Group {
  id: number;
  parameters: ApiParameter[];
  returns: ApiParameter | null;
}

const DEFAULT_TYPES = new Set([
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
]);

const isDefaultType = (type: string) => DEFAULT_TYPES.has(type.toLowerCase());

export const FunctionApi = ({ apiParameters }: FunctionApiProps) => {
  let groupIndex = 0;
  const groups: Group[] = [{ id: groupIndex, parameters: [], returns: null }];

  apiParameters.forEach((parameter, index) => {
    if (parameter.tag === 'overload') {
      const isFirstOverload =
        apiParameters.findIndex(({ tag }) => tag === 'overload') === index;

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
    <div className='space-y-8'>
      {groups.map((group) => (
        <div key={group.id} className='space-y-4'>
          {group.parameters.length > 0 && (
            <>
              <h3>Parameters</h3>

              <div className='no-scrollbar w-full overflow-y-auto rounded-xl border'>
                <table className='relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0'>
                  <thead>
                    <tr className='m-0 border-b'>
                      <th className='px-4 py-2 text-left font-bold'>Name</th>
                      <th className='px-4 py-2 text-left font-bold'>Type</th>
                      <th className='px-4 py-2 text-left font-bold'>Default</th>
                      <th className='px-4 py-2 text-left font-bold'>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.parameters.map((parameter) => (
                      <tr key={parameter.name} className='m-0 border-b'>
                        <td className='px-4 py-2 text-left'>
                          {parameter.name}
                          {parameter.optional ? '?' : ''}
                        </td>
                        <td className='px-4 py-2 text-left whitespace-nowrap'>
                          {isDefaultType(parameter.type) ? (
                            parameter.type
                          ) : (
                            <a className='font-medium underline underline-offset-4' href='#'>
                              {parameter.type}
                            </a>
                          )}
                        </td>
                        <td className='px-4 py-2 text-left'>{parameter.default ?? '-'}</td>
                        <td className='px-4 py-2 text-left'>{parameter.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {group.returns && (
            <div className='space-y-2'>
              <h3>Returns</h3>
              <p>
                <code>{group.returns.type}</code>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};