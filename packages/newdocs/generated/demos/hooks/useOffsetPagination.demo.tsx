'use client';

import { useOffsetPagination } from '@siberiacancode/reactuse';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const TOTAL = 48;
const PAGE_SIZE = 6;

interface User {
  email: string;
  id: number;
  joined: string;
  name: string;
  role: string;
  status: 'active' | 'invited';
}

const ROLES = ['Admin', 'Editor', 'Viewer'];
const NAMES = ['Alex', 'Maria', 'John', 'Sofia', 'Liam', 'Emma', 'Noah', 'Olivia'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const createUsers = (page: number): User[] =>
  Array.from({ length: PAGE_SIZE }, (_, index) => {
    const id = PAGE_SIZE * (page - 1) + index + 1;
    const name = NAMES[id % NAMES.length];
    return {
      id,
      name,
      email: `${name.toLowerCase()}${id}@reactuse.dev`,
      role: ROLES[id % ROLES.length],
      status: id % 3 === 0 ? 'invited' : 'active',
      joined: `${MONTHS[id % MONTHS.length]} ${new Date().getFullYear() + (id % 5)}`
    };
  });

const getPages = (page: number, pageCount: number): (number | 'ellipsis')[] => {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < pageCount - 1) pages.push('ellipsis');

  pages.push(pageCount);
  return pages;
};

const Demo = () => {
  const [users, setUsers] = useState<User[]>(() => createUsers(1));

  const { page, pageCount, isFirstPage, isLastPage, next, prev, setPage } = useOffsetPagination({
    total: TOTAL,
    initialPage: 1,
    initialPageSize: PAGE_SIZE,
    onChange: ({ page }) => setUsers(createUsers(page))
  });

  const pages = getPages(page, pageCount);

  return (
    <section className='flex w-full max-w-lg flex-col gap-4 p-4'>
      <div data-slot='table-container'>
        <table data-slot='table'>
          <thead data-slot='table-header'>
            <tr data-slot='table-row'>
              <th data-slot='table-head'>User</th>
              <th data-slot='table-head'>Role</th>
              <th data-slot='table-head'>Status</th>
              <th className='text-right!' data-slot='table-head'>
                Joined
              </th>
            </tr>
          </thead>
          <tbody data-slot='table-body'>
            {users.map((user) => (
              <tr key={user.id} data-slot='table-row'>
                <td data-slot='table-cell'>
                  <div className='flex flex-col leading-tight'>
                    <span className='text-foreground font-medium'>{user.name}</span>
                    <span className='text-muted-foreground text-xs'>{user.email}</span>
                  </div>
                </td>
                <td className='text-muted-foreground' data-slot='table-cell'>
                  {user.role}
                </td>
                <td data-slot='table-cell'>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-medium',
                      user.status === 'active' ? 'text-green-500' : 'text-muted-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        user.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'
                      )}
                    />
                    {user.status === 'active' ? 'Active' : 'Invited'}
                  </span>
                </td>
                <td className='text-muted-foreground text-right!' data-slot='table-cell'>
                  {user.joined}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-end gap-1'>
        <button data-variant='ghost' disabled={isFirstPage} type='button' onClick={prev}>
          <ChevronLeftIcon className='size-4' />
          Previous
        </button>

        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className='text-muted-foreground flex size-8 items-center justify-center text-sm'
            >
              …
            </span>
          ) : (
            <button
              key={item}
              className={cn(item === page && 'bg-accent text-accent-foreground')}
              data-size='icon'
              data-variant='ghost'
              type='button'
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          )
        )}

        <button data-variant='ghost' disabled={isLastPage} type='button' onClick={next}>
          Next
          <ChevronRightIcon className='size-4' />
        </button>
      </div>
    </section>
  );
};

export default Demo;
