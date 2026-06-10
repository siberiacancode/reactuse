import { useBrowserLocation } from '@siberiacancode/reactuse';
import {
  ArrowLeftIcon,
  AtSignIcon,
  CheckIcon,
  CreditCardIcon,
  LandmarkIcon,
  WalletIcon
} from 'lucide-react';

type PaymentMethod = 'bank' | 'card' | 'paypal';
const PAYMENT_METHODS = [
  {
    id: 'card',
    title: 'Card',
    description: 'Pay with Visa or Mastercard',
    icon: CreditCardIcon
  },
  {
    id: 'paypal',
    title: 'PayPal',
    description: 'Use your PayPal wallet',
    icon: WalletIcon
  },
  {
    id: 'bank',
    title: 'Bank transfer',
    description: 'Pay from your bank account',
    icon: LandmarkIcon
  }
] as const;

const Demo = () => {
  const location = useBrowserLocation();

  const step = Number(location.value.searchParams.get('step') ?? 1);
  const selectedMethod = location.value.searchParams.get('method') ?? 'card';
  const email = location.value.searchParams.get('email') ?? '';

  const currentMethod =
    PAYMENT_METHODS.find((method) => method.id === selectedMethod) ?? PAYMENT_METHODS[0];

  const updateSearch = (params: Record<string, number | string>) => {
    const searchParams = new URLSearchParams(location.value.search);

    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value));
    });

    location.push(`?${searchParams.toString()}`);
  };

  const onPaymentMethodChange = (method: PaymentMethod) => updateSearch({ step: 1, method, email });
  const onEmailChange = (email: string) => updateSearch({ email });
  const onCompletePayment = () => updateSearch({ step: 2, method: selectedMethod, email });

  return (
    <section className='flex min-w-sm flex-col gap-5 p-4 md:min-w-md'>
      {step === 1 && (
        <>
          <div className='flex flex-col gap-1'>
            <h3>Complete payment</h3>
            <p className='text-muted-foreground text-sm'>Enter your payment method</p>
          </div>

          <div className='flex flex-col gap-2'>
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;

              return (
                <label
                  key={method.id}
                  className='border-border hover:bg-muted/50 has-[:checked]:border-foreground/30 has-[:checked]:bg-muted/50 relative flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-colors'
                >
                  <input
                    checked={isSelected}
                    className='absolute! top-4 right-4'
                    name='method'
                    type='radio'
                    onChange={() => onPaymentMethodChange(method.id)}
                  />

                  <div className='bg-card flex size-10 items-center justify-center rounded-full border'>
                    <Icon className='size-4' />
                  </div>

                  <span className='flex flex-1 flex-col gap-1'>
                    <span className='text-sm'>{method.title}</span>
                    <span className='text-muted-foreground text-xs'>{method.description}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className='relative'>
            <AtSignIcon className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50' />
            <input
              className='pl-8!'
              placeholder='you@example.com'
              type='email'
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </div>

          <div className='flex justify-end'>
            <button disabled={!email} type='button' onClick={onCompletePayment}>
              Pay now
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className='flex flex-col gap-4'>
          <div className='border-border bg-card flex flex-col items-center gap-4 rounded-2xl border px-6 py-8 text-center'>
            <div className='flex size-14 items-center justify-center rounded-full bg-green-500/10 text-green-500'>
              <CheckIcon className='size-8' />
            </div>

            <div className='flex flex-col items-center gap-2'>
              <h4>Payment successful</h4>
              <p className='text-muted-foreground max-w-xs text-sm'>
                Your order is confirmed and the receipt has been sent to {email}.
              </p>
            </div>

            <div className='bg-muted/50 flex w-full max-w-xs flex-col gap-2 rounded-xl p-4 text-left'>
              <div className='flex items-center justify-between gap-3 text-sm'>
                <span className='text-muted-foreground'>Payment method</span>
                <span className='text-foreground font-medium'>{currentMethod.title}</span>
              </div>
              <div className='flex items-center justify-between gap-3 text-sm'>
                <span className='text-muted-foreground'>Email</span>
                <span className='text-foreground font-medium'>{email}</span>
              </div>
            </div>
          </div>

          <div className='flex justify-start'>
            <button data-variant='outline' type='button' onClick={() => location.back()}>
              <ArrowLeftIcon className='size-4' /> Back
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Demo;
