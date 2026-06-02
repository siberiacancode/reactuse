'use client'

import { useList } from '@siberiacancode/reactuse';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Todo {
  done: boolean;
  id: string;
  text: string;
}

const Demo = () => {
  const todos = useList<Todo>([
    { id: '1', text: 'Read reactuse docs', done: true },
    { id: '2', text: 'Try useList in a side project', done: false },
    { id: '3', text: 'Star siberiacancode/reactuse on GitHub', done: false }
  ]);

  const [value, setValue] = useState('');

  const onAdd = () => {
    const text = value.trim();
    if (!text) return;
    todos.push({ id: crypto.randomUUID(), text, done: false });
    setValue('');
  };

  const onToggle = (index: number, todo: Todo) => {
    todos.updateAt(index, { ...todo, done: !todo.done });
  };

  const remaining = todos.value.filter((todo) => !todo.done).length;

  return (
    <section className='flex w-full max-w-sm flex-col gap-3 p-4'>
      <h2 className='text-foreground text-sm font-semibold'>Today's tasks</h2>

      <div className='flex items-center gap-2'>
        <input
          className='border-border bg-card text-foreground placeholder:text-muted-foreground flex-1 rounded-md border px-3 py-2 text-sm outline-none'
          placeholder='What needs to be done?'
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onAdd();
          }}
        />
        <button disabled={!value.trim()} type='button' onClick={onAdd}>
          Add
        </button>
      </div>

      <div className='flex flex-col'>
        {todos.value.map((todo, index) => (
          <div
            key={todo.id}
            className='group hover:bg-muted/40 -mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors'
          >
            <label className='flex shrink-0 cursor-pointer items-center'>
              <input
                checked={todo.done}
                className='peer sr-only'
                type='checkbox'
                onChange={() => onToggle(index, todo)}
              />
              <span
                className={cn(
                  'border-border peer-checked:border-foreground peer-checked:bg-foreground flex size-4 items-center justify-center rounded-[5px] border transition-colors'
                )}
              >
                {todo.done && <CheckIcon className='text-background size-3' strokeWidth={3.5} />}
              </span>
            </label>

            <span
              className={cn(
                'flex-1 text-sm transition-colors',
                todo.done ? 'text-muted-foreground line-through' : 'text-foreground'
              )}
            >
              {todo.text}
            </span>

            <button
              aria-label='Remove'
              className='rounded-full! opacity-0 transition-opacity group-hover:opacity-100'
              data-size='icon-xs'
              data-variant='ghost'
              type='button'
              onClick={() => todos.removeAt(index)}
            >
              <XIcon className='size-3' />
            </button>
          </div>
        ))}
      </div>

      <span className='text-muted-foreground px-1 text-[10px]'>
        {remaining === 0
          ? 'All done — nice work ✨'
          : `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`}
      </span>
    </section>
  );
};

export default Demo;
