'use client'

import { useDebounceCallback, useObject } from '@siberiacancode/reactuse';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const PRODUCTS = [
  { emoji: '🎧', name: 'Headphones', category: 'Electronics', price: 89, stock: true },
  { emoji: '⌨️', name: 'Keyboard', category: 'Electronics', price: 129, stock: true },
  { emoji: '🖱️', name: 'Mouse', category: 'Electronics', price: 49, stock: false },
  { emoji: '🖥️', name: 'Monitor', category: 'Electronics', price: 329, stock: true },
  { emoji: '📷', name: 'Camera', category: 'Electronics', price: 549, stock: false },
  { emoji: '🎒', name: 'Backpack', category: 'Accessories', price: 79, stock: true },
  { emoji: '🧢', name: 'Cap', category: 'Accessories', price: 24, stock: true },
  { emoji: '🕶️', name: 'Sunglasses', category: 'Accessories', price: 95, stock: false },
  { emoji: '⌚', name: 'Watch', category: 'Accessories', price: 199, stock: true },
  { emoji: '👜', name: 'Handbag', category: 'Accessories', price: 149, stock: true }
];

const CATEGORIES = ['All', 'Electronics', 'Accessories'];

interface Filters {
  category: string;
  inStock: boolean;
  search: string;
}

const Demo = () => {
  const [search, setSearch] = useState('');
  const filters = useObject<Filters>({ search: '', category: 'All', inStock: false });

  const debouncedSearch = useDebounceCallback((value: string) => {
    filters.set({ search: value });
  }, 400);

  const onSearch = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const filtered = PRODUCTS.filter((product) => {
    if (filters.value.category !== 'All' && product.category !== filters.value.category)
      return false;
    if (filters.value.inStock && !product.stock) return false;
    if (
      filters.value.search &&
      !product.name.toLowerCase().includes(filters.value.search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <section className='flex w-full max-w-lg flex-col gap-4 p-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
        <div className='relative sm:min-w-[160px] sm:flex-1'>
          <SearchIcon className='text-muted-foreground absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2' />
          <input
            className='border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border py-1 pr-2.5 pl-8! text-sm outline-none focus-visible:ring-3'
            placeholder='Search products'
            type='text'
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>

        <div className='flex gap-2'>
          <select
            className='flex-1 sm:flex-none'
            value={filters.value.category}
            onChange={(event) => filters.set({ category: event.target.value })}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            className='flex-1 sm:flex-none'
            data-variant={filters.value.inStock ? 'default' : 'outline'}
            type='button'
            onClick={() => filters.set({ inStock: !filters.value.inStock })}
          >
            In stock
          </button>
        </div>
      </div>

      <div data-slot='table-container'>
        <table data-slot='table'>
          <thead data-slot='table-header'>
            <tr data-slot='table-row'>
              <th data-slot='table-head'>Product</th>
              <th data-slot='table-head'>Category</th>
              <th data-slot='table-head'>Stock</th>
              <th className='text-right!' data-slot='table-head'>
                Price
              </th>
            </tr>
          </thead>
          <tbody data-slot='table-body'>
            {filtered.map((product) => (
              <tr key={product.name} data-slot='table-row'>
                <td data-slot='table-cell'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg'>{product.emoji}</span>
                    <span className='text-foreground font-medium'>{product.name}</span>
                  </div>
                </td>
                <td className='text-muted-foreground' data-slot='table-cell'>
                  {product.category}
                </td>
                <td data-slot='table-cell'>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-medium',
                      product.stock ? 'text-green-500' : 'text-muted-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        product.stock ? 'bg-green-500' : 'bg-muted-foreground'
                      )}
                    />
                    {product.stock ? 'In stock' : 'Out'}
                  </span>
                </td>
                <td className='text-right! font-medium tabular-nums' data-slot='table-cell'>
                  ${product.price}
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr data-slot='table-row'>
                <td
                  className='text-muted-foreground py-6 text-center!'
                  colSpan={4}
                  data-slot='table-cell'
                >
                  No products match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Demo;
