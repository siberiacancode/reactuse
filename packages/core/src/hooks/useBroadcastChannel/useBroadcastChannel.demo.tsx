import { useBroadcastChannel } from '@siberiacancode/reactuse';
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const STORAGE_KEY = 'reactuse-shop-cart';

const PRODUCTS = [
  { id: 1, name: 'Headphones', price: 79.99, emoji: '🎧' },
  { id: 2, name: 'Keyboard', price: 129.99, emoji: '⌨️' },
  { id: 3, name: 'USB-C Hub', price: 49.99, emoji: '🔌' },
  { id: 4, name: 'Webcam HD', price: 89.99, emoji: '📷' }
];

interface CartItem {
  id: number;
  qty: number;
}
interface CartMessage {
  cart: CartItem[];
  type: 'sync';
}

const Demo = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  });

  const broadcastChannel = useBroadcastChannel<CartMessage>('reactuse-shop-cart', (data) => {
    if (data.type === 'sync') {
      setCart(data.cart);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.cart));
    }
  });

  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
    broadcastChannel.post({ type: 'sync', cart: newCart });
  };

  const onAdd = (id: number) => {
    const cartItem = cart.find((item) => item.id === id);
    const newCart = cartItem
      ? cart.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
      : [...cart, { id, qty: 1 }];
    syncCart(newCart);
  };

  const onDecrease = (id: number) => {
    const cartItem = cart.find((item) => item.id === id);
    if (!cartItem) return;

    const newCart =
      cartItem.qty === 1
        ? cart.filter((item) => item.id !== id)
        : cart.map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item));
    syncCart(newCart);
  };

  const onRemove = (id: number) => syncCart(cart.filter((item) => item.id !== id));

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product?.price ?? 0) * item.qty;
  }, 0);

  if (!broadcastChannel.supported) {
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );
  }

  return (
    <section className='flex w-full flex-col gap-4 px-2 pt-6 md:px-6'>
      <div className='flex items-center justify-between px-2 pb-3'>
        <h3 className='text-base! font-semibold'>Shop</h3>
        <div className='relative'>
          <ShoppingCartIcon className='size-5' />
          {!!totalCount && (
            <span className='bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full text-[9px] font-bold'>
              {totalCount}
            </span>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='grid flex-1 grid-cols-1 gap-3 md:grid-cols-2'>
          {PRODUCTS.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            return (
              <div key={product.id} className='flex flex-col gap-2 rounded-xl border p-3'>
                <div className='bg-muted flex h-14 items-center justify-center rounded-lg text-3xl'>
                  {product.emoji}
                </div>
                <div>
                  <p className='text-sm leading-tight font-medium'>{product.name}</p>
                  <p className='text-muted-foreground text-xs'>${product.price}</p>
                </div>
                {!!cartItem && (
                  <div className='flex items-center justify-between px-1'>
                    <button
                      className='text-muted-foreground hover:text-foreground bg-transparent'
                      type='button'
                      onClick={() => onDecrease(product.id)}
                    >
                      <MinusIcon className='size-3' />
                    </button>
                    <span className='w-4 text-center text-xs font-semibold'>{cartItem.qty}</span>
                    <button
                      className='text-muted-foreground hover:text-foreground bg-transparent'
                      type='button'
                      onClick={() => onAdd(product.id)}
                    >
                      <PlusIcon className='size-3' />
                    </button>
                  </div>
                )}

                {!cartItem && (
                  <button
                    className='bg-primary text-primary-foreground flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium'
                    type='button'
                    onClick={() => onAdd(product.id)}
                  >
                    <PlusIcon className='size-3' />
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className='flex w-full shrink-0 flex-col gap-2 rounded-xl border p-3 md:w-52'>
          <p className='text-sm font-semibold'>Cart</p>
          {!cart.length && <p className='text-muted-foreground text-xs'>Empty</p>}
          {!!cart.length && (
            <>
              <div className='flex flex-col gap-2'>
                {cart.map((item) => {
                  const product = PRODUCTS.find((product) => product.id === item.id)!;
                  return (
                    <div key={item.id} className='flex items-start justify-between gap-1'>
                      <div className='min-w-0'>
                        <p className='truncate text-xs font-medium'>
                          {product.emoji} {product.name}
                        </p>
                        <p className='text-muted-foreground text-[10px]'>
                          ×{item.qty} · ${(product.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                      <button
                        className='text-muted-foreground hover:text-foreground mt-0.5 shrink-0 bg-transparent'
                        type='button'
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2Icon className='size-3' />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className='border-t pt-2 text-xs font-semibold'>${totalPrice.toFixed(2)}</div>
            </>
          )}
          <p className='text-muted-foreground mt-auto text-[10px] leading-tight'>
            Synced across tabs
          </p>
        </div>
      </div>
    </section>
  );
};

export default Demo;
