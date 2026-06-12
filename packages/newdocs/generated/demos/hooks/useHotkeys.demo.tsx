'use client';

import { useDisclosure, useField, useHotkeys, useKeyPress } from '@siberiacancode/reactuse';
import { FileTextIcon, HomeIcon, PlusIcon, SearchIcon, SettingsIcon } from 'lucide-react';

const COMMANDS = [
  {
    id: 'home',
    label: 'Go to home',
    group: 'Navigation',
    hotkey: 'control+h',
    shortcut: ['Ctrl', 'H'],
    icon: HomeIcon
  },
  {
    id: 'projects',
    label: 'Go to projects',
    group: 'Navigation',
    hotkey: 'control+p',
    shortcut: ['Ctrl', 'P'],
    icon: FileTextIcon
  },
  {
    id: 'new',
    label: 'Create new document',
    group: 'Actions',
    hotkey: 'control+n',
    shortcut: ['Ctrl', 'N'],
    icon: PlusIcon
  },
  {
    id: 'settings',
    label: 'Open settings',
    group: 'Actions',
    hotkey: 'control+s',
    shortcut: ['Ctrl', 'S'],
    icon: SettingsIcon
  }
] as const;

type Command = (typeof COMMANDS)[number];

const matchesCommand = (command: Command, query: string) => {
  if (!query) return true;
  const haystack = [command.label, command.group, ...command.shortcut].join(' ').toLowerCase();
  return haystack.includes(query);
};

interface CommandItemProps {
  command: Command;
  onRun: (command: Command) => void;
}

const CommandItem = ({ command, onRun }: CommandItemProps) => {
  useHotkeys(command.hotkey, () => onRun(command));

  return (
    <button
      className='hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors'
      data-variant='unstyled'
      type='button'
      onClick={() => onRun(command)}
    >
      <command.icon className='text-muted-foreground size-4 shrink-0' />
      <span className='text-foreground flex-1 text-left text-sm'>{command.label}</span>
      <div className='flex items-center gap-1'>
        {command.shortcut.map((key, index) => (
          <kbd
            key={index}
            className='border-border bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded border px-1.5 font-mono text-[10px] font-medium'
          >
            {key}
          </kbd>
        ))}
      </div>
    </button>
  );
};

const Demo = () => {
  const palette = useDisclosure();
  const search = useField('');

  const runCommand = () => {
    palette.close();
    search.setValue('');
  };

  useHotkeys('control+k', () => palette.open());
  useKeyPress('escape', () => palette.close());

  const query = search.watch().trim().toLowerCase();
  const filtered = COMMANDS.filter((command) => matchesCommand(command, query));
  const groups = [...new Set(filtered.map(({ group }) => group))];

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        className='border-border bg-card flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2'
        onClick={palette.open}
      >
        <div className='flex items-center gap-2'>
          <SearchIcon className='text-muted-foreground size-4' />
          <span className='text-muted-foreground text-sm'>Search commands...</span>
        </div>

        <button type='button'>CtrlK</button>
      </div>

      {palette.opened && (
        <div
          className='animate-in fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-sm duration-150'
          onClick={palette.close}
        >
          <div
            className='animate-in fade-in slide-in-from-top-2 border-border bg-card flex w-full max-w-md flex-col overflow-hidden rounded-xl border p-2 shadow-2xl duration-150'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='border-border relative border-b'>
              <SearchIcon className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
              <input
                autoFocus
                className='text-foreground placeholder:text-muted-foreground w-full bg-transparent py-3! pl-8! text-sm outline-none'
                placeholder='Type a command or search...'
                {...search.register()}
              />
            </div>

            <div className='mt-2'>
              {!filtered.length && (
                <div className='text-muted-foreground py-8 text-center text-sm'>
                  No commands found
                </div>
              )}

              {groups.map((group) => (
                <div key={group} className='mb-1'>
                  <div className='text-muted-foreground px-3 py-1.5 text-[10px] tracking-wider uppercase'>
                    {group}
                  </div>
                  {filtered
                    .filter((command) => command.group === group)
                    .map((command) => (
                      <CommandItem key={command.id} command={command} onRun={runCommand} />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Demo;
