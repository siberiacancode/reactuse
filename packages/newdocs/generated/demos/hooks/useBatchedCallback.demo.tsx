'use client'

import { useBatchedCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

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
    <section className='flex max-w-md flex-col items-center gap-4'>
      <div className='flex flex-col gap-1 text-center'>
        <h3>What will you use the service for?</h3>
      </div>

      <div className='mb-6 flex flex-wrap justify-center gap-2'>
        {INTERESTS.map((interest) => (
          <button
            key={interest.tag}
            data-variant={tags.includes(interest.tag) ? 'outline' : 'default'}
            type='button'
            onClick={() => onToggle(interest.tag)}
          >
            {interest.label}
          </button>
        ))}
      </div>

      <div className='flex flex-col gap-6 px-6 md:flex-row'>
        <p className='text-muted-foreground text-center text-left text-xs'>
          We batch analytics events for economy of scale. So far we tracked{' '}
          <code>{totalEvents}</code> events and sent <code>{requestsSent}</code> requests.
        </p>
      </div>
    </section>
  );
};

export default Demo;
