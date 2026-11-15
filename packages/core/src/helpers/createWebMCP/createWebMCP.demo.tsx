import { createWebMCP } from '@siberiacancode/reactuse';
import { BotIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const Demo = () => {
  const [webMCP] = useState(createWebMCP);

  useEffect(() => {
    if (!webMCP.supported) return;

    webMCP.register({
      name: 'get-react-hooks',
      title: 'Get React hooks',
      description: 'Returns all React hooks available in the reactuse documentation',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => {
        const hooks = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href*="/functions/hooks/"]')
        )
          .map((link) => link.href.split('/').filter(Boolean).at(-1))
          .filter((name): name is string => !!name?.startsWith('use'));

        const uniqueHooks = [...new Set(hooks)].sort();

        return {
          count: uniqueHooks.length,
          hooks: uniqueHooks
        };
      }
    });

    return webMCP.clear;
  }, []);

  if (!webMCP.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a href='https://developer.chrome.com/docs/ai/webmcp' rel='noreferrer' target='_blank'>
          API
        </a>
      </p>
    );
  }

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-4 p-4 text-center'>
      <div className='bg-muted flex size-14 items-center justify-center rounded-full'>
        <BotIcon className='size-7' />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-xl!'>React hooks for your agent</h3>
        <p className='text-muted-foreground text-sm'>Get the complete list of reactuse hooks.</p>
      </div>
    </section>
  );
};

export default Demo;
