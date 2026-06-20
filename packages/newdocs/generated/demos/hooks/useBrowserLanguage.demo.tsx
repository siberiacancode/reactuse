'use client'

import { useBrowserLanguage } from '@siberiacancode/reactuse';
import { GlobeIcon } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    greeting: 'Hello!',
    subtitle: 'Welcome to reactuse'
  },
  ru: {
    greeting: 'Privet!',
    subtitle: 'Dobro pozhalovat v reactuse'
  },
  es: {
    greeting: 'Hola!',
    subtitle: 'Bienvenido a reactuse'
  },
  de: {
    greeting: 'Hallo!',
    subtitle: 'Willkommen bei reactuse'
  },
  fr: {
    greeting: 'Bonjour!',
    subtitle: 'Bienvenue sur reactuse'
  },
  it: {
    greeting: 'Ciao!',
    subtitle: 'Benvenuto su reactuse'
  },
  ja: {
    greeting: 'Konnichiwa!',
    subtitle: 'Welcome to reactuse'
  },
  zh: {
    greeting: 'Ni hao!',
    subtitle: 'Welcome to reactuse'
  },
  pt: {
    greeting: 'Ola!',
    subtitle: 'Bem-vindo ao reactuse'
  }
};

const getTranslation = (language: string) => {
  const [code] = language.split('-');
  return TRANSLATIONS[code.toLowerCase() as keyof typeof TRANSLATIONS] ?? TRANSLATIONS.en;
};

const getLanguage = (browserLanguage: string) =>
  browserLanguage === 'undetermined' ? 'en' : browserLanguage;

const Demo = () => {
  const browserLanguage = useBrowserLanguage();
  const language = getLanguage(browserLanguage);
  const translation = getTranslation(language);

  const formattedDate = new Intl.DateTimeFormat(language, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());
  const formattedNumber = new Intl.NumberFormat(language).format(1234567.89);
  const formattedPrice = new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'USD'
  }).format(1299.99);
  const formattedRelative = new Intl.RelativeTimeFormat(language, { numeric: 'auto' }).format(
    -2,
    'day'
  );

  return (
    <section className='flex w-full min-w-0 flex-col items-center p-4'>
      <div className='flex w-full max-w-md min-w-0 flex-col gap-5 p-6'>
        <div className='flex flex-col gap-2'>
          <div>
            <h3>{translation.greeting}</h3>
            <p className='text-muted-foreground text-sm'>{translation.subtitle}</p>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <GlobeIcon className='size-4 shrink-0' />
            <span className='min-w-0 break-all'>
              Detected: <code>{language}</code>
            </span>
          </div>
        </div>

        <div className='flex min-w-0 flex-col gap-2 border-t py-3 text-sm'>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-muted-foreground'>Today</span>
            <strong className='min-w-0 text-right break-words'>{formattedDate}</strong>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-muted-foreground'>Last seen</span>
            <strong className='min-w-0 text-right break-words'>{formattedRelative}</strong>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-muted-foreground'>Number</span>
            <strong className='min-w-0 text-right break-words'>{formattedNumber}</strong>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-muted-foreground'>Price</span>
            <strong className='min-w-0 text-right break-words'>{formattedPrice}</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
