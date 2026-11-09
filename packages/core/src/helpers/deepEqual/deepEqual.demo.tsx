import { deepEqual } from '@siberiacancode/reactuse';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const MAX_INLINE_WIDTH = 32;

const stringify = (value: unknown, indent = 0, seen = new Set<object>(), offset = 0): string => {
  if (typeof value === 'string') return `'${value}'`;
  if (typeof value !== 'object' || value === null) return String(value);
  if (seen.has(value)) return '[Circular]';
  if (value instanceof Date) return `Date('${value.toISOString().slice(0, 10)}')`;
  if (value instanceof RegExp) return String(value);

  const pad = '  '.repeat(indent + 1);
  const close = '  '.repeat(indent);

  seen.add(value);

  const wrap = (prefix: string, brackets: '[]' | '{}', entries: string[]) => {
    seen.delete(value);

    const [open, end] = brackets;
    if (!entries.length) return `${prefix}${open}${end}`;

    const inline = entries.join(', ');
    const line = brackets === '[]' ? `${prefix}[${inline}]` : `${prefix}{ ${inline} }`;
    if (indent * 2 + offset + line.length <= MAX_INLINE_WIDTH && !inline.includes('\n'))
      return line;

    return `${prefix}${open}\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${close}${end}`;
  };

  if (Array.isArray(value))
    return wrap(
      '',
      '[]',
      value.map((item) => stringify(item, indent + 1, seen))
    );

  if (value instanceof Set)
    return wrap(
      'Set ',
      '{}',
      [...value].map((item) => stringify(item, indent + 1, seen))
    );

  if (value instanceof Map)
    return wrap(
      'Map ',
      '{}',
      [...value].map(([key, item]) => {
        const name = `${stringify(key)} => `;
        return `${name}${stringify(item, indent + 1, seen, name.length)}`;
      })
    );

  return wrap(
    '',
    '{}',
    Object.entries(value).map(
      ([key, item]) => `${key}: ${stringify(item, indent + 1, seen, key.length + 2)}`
    )
  );
};

const createCircular = (label: string) => {
  const node: Record<string, unknown> = { label };
  node.self = node;
  return node;
};

interface Case {
  description: string;
  label: string;
  value: string;
  create: (diverge: boolean) => [unknown, unknown];
}

const CASES: Case[] = [
  {
    value: 'nested',
    label: 'Nested',
    description: 'Objects are compared key by key, all the way down',
    create: (diverge) => [
      { user: { name: 'siberiacancode', profile: { stars: 1200, tags: ['react', 'hooks'] } } },
      {
        user: {
          name: 'siberiacancode',
          profile: { stars: 1200, tags: ['react', diverge ? 'state' : 'hooks'] }
        }
      }
    ]
  },
  {
    value: 'array',
    label: 'Arrays',
    description: 'Arrays match by length and index, so order matters',
    create: (diverge) => [
      [1, [2, 3], { done: true }],
      diverge ? [1, [3, 2], { done: true }] : [1, [2, 3], { done: true }]
    ]
  },
  {
    value: 'date',
    label: 'Dates',
    description: 'Dates compare by timestamp, not by reference',
    create: (diverge) => [
      { releasedAt: new Date('2024-01-01') },
      { releasedAt: new Date(diverge ? '2024-06-01' : '2024-01-01') }
    ]
  },
  {
    value: 'collections',
    label: 'Set & Map',
    description: 'Map values are compared deeply, Set members and Map keys by reference',
    create: (diverge) => [
      new Map([['owners', new Set([{ id: 1 }, { id: 2 }])]]),
      new Map([['owners', new Set([{ id: 1 }, { id: diverge ? 3 : 2 }])]])
    ]
  },
  {
    value: 'regexp',
    label: 'RegExp',
    description: 'Regular expressions compare by source and flags',
    create: (diverge) => [{ pattern: /ab+c/gi }, { pattern: diverge ? /ab+c/g : /ab+c/gi }]
  },
  {
    value: 'circular',
    label: 'Circular',
    description: 'Circular references are tracked, so comparison never loops forever',
    create: (diverge) => [createCircular('node'), createCircular(diverge ? 'other' : 'node')]
  }
];

interface ValuePanelProps {
  name: string;
  value: unknown;
}

const ValuePanel = ({ name, value }: ValuePanelProps) => (
  <div className='border-border bg-card flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border p-2.5'>
    <span className='text-muted-foreground font-mono text-xs font-medium'>{name}</span>
    <pre className='text-foreground font-mono text-xs leading-relaxed break-words whitespace-pre-wrap'>
      {stringify(value)}
    </pre>
  </div>
);

const Demo = () => {
  const [activeCase, setActiveCase] = useState(CASES[0]);
  const [diverge, setDiverge] = useState(false);

  const [a, b] = activeCase.create(diverge);
  const equal = deepEqual(a, b);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap gap-1.5'>
        {CASES.map((item) => (
          <button
            key={item.value}
            data-size='xs'
            data-variant={item.value === activeCase.value ? 'secondary' : 'ghost'}
            type='button'
            onClick={() => setActiveCase(item)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className='text-muted-foreground text-sm'>{activeCase.description}</p>

      <div className='flex flex-col gap-2 sm:flex-row'>
        <ValuePanel name='a' value={a} />
        <ValuePanel name='b' value={b} />
      </div>

      <div className='border-border flex flex-wrap items-center justify-between gap-3 rounded-lg border p-2.5'>
        <label className='flex items-center gap-2 text-sm'>
          <input
            checked={diverge}
            role='switch'
            type='checkbox'
            onChange={(event) => setDiverge(event.target.checked)}
          />
          Change one value in <code>b</code>
        </label>

        <div className='flex flex-wrap items-center gap-1.5'>
          <span data-slot='badge' data-variant='outline'>
            <XIcon />a === b: {String(Object.is(a, b))}
          </span>
          <span data-slot='badge' data-variant={equal ? 'default' : 'destructive'}>
            {equal ? <CheckIcon /> : <XIcon />}
            deepEqual(a, b): {String(equal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Demo;
