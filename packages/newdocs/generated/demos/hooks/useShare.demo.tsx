'use client'

import { useShare } from '@siberiacancode/reactuse';
import { CheckIcon, GiftIcon, Share2Icon } from 'lucide-react';

const REFERRAL_URL = 'https://siberiacancode.github.io/reactuse?ref=debabin';

const PERKS = ['20% off their first year', 'You earn 20% back too', 'Stacks up to 5 friends'];

const Demo = () => {
  const share = useShare({
    title: 'Join me on reactuse',
    text: 'Use my link to sign up and we both get 20% off the Pro plan.',
    url: REFERRAL_URL
  });

  if (!share.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card text-card-foreground flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm'>
        <div className='flex flex-col gap-1 px-4'>
          <div className='bg-muted text-foreground mb-3 flex size-10 items-center justify-center rounded-lg'>
            <GiftIcon className='size-5' />
          </div>
          <div className='text-2xl! font-semibold tracking-tight'>Get 20% off Pro</div>
          <div className='text-muted-foreground text-sm'>
            Invite a friend to reactuse Pro — they save 20%, and so do you.
          </div>
        </div>

        <div className='px-4'>
          <ul className='flex flex-col gap-2.5'>
            {PERKS.map((perk) => (
              <li key={perk} className='flex items-center gap-2.5 text-sm'>
                <CheckIcon className='text-primary size-4 shrink-0' />
                <span className='text-foreground'>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex items-center border-t p-4'>
          <button className='w-full! py-4!' type='button' onClick={() => share.trigger({})}>
            <Share2Icon className='size-4' />
            Share invite link
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
