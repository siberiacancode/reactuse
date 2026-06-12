'use client';

import { useBatchedCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface AnalyticsEvent {
  action: 'deselected' | 'selected';
  tag: string;
}

const INTERESTS = [
  { tag: 'work', label: 'Work' },
  { tag: 'study', label: 'Study' },
  { tag: 'hobby', label: 'Hobby' },
  { tag: 'business', label: 'Business' },
  { tag: 'creative', label: 'Creative' },
  { tag: 'team', label: 'Team' },
  { tag: 'research', label: 'Research' },
  { tag: 'fun', label: 'Fun' },
  { tag: 'other', label: 'Other' }
];

const Demo = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [requestsSent, setRequestsSent] = useState(0);

  const sendAnalytics = useBatchedCallback<AnalyticsEvent[]>(
    () => setRequestsSent((current) => current + 1),
    { size: 5, delay: 1500 }
  );

  const onToggle = (tag: string) => {
    const isSelected = tags.includes(tag);
    const action: AnalyticsEvent['action'] = isSelected ? 'deselected' : 'selected';

    setTags((current) => (isSelected ? current.filter((item) => item !== tag) : [...current, tag]));

    const event: AnalyticsEvent = { tag, action };
    setTotalEvents((current) => current + 1);
    sendAnalytics(event);
  };

  return (
    <section className='flex max-w-md flex-col items-center gap-4 p-4'>
      <h3 className='text-foreground text-center text-base font-semibold'>
        What will you use the service for?
      </h3>

      <div className='flex flex-wrap justify-center gap-1'>
        {INTERESTS.map((interest) => {
          const active = tags.includes(interest.tag);
          return (
            <button
              key={interest.tag}
              className={cn(
                'h-9 rounded-full! px-3 text-sm font-medium transition-colors',
                active
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-foreground hover:bg-accent'
              )}
              data-variant='unstyled'
              type='button'
              onClick={() => onToggle(interest.tag)}
            >
              {interest.label}
            </button>
          );
        })}
      </div>

      <p className='text-muted-foreground max-w-xs text-center text-xs'>
        We batch analytics events for economy of scale. So far we tracked <code>{totalEvents}</code>{' '}
        events and sent <code>{requestsSent}</code> requests.
      </p>
    </section>
  );
};

export default Demo;
