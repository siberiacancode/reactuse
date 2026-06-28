'use client';

import { useVisibility } from '@siberiacancode/reactuse';
import { ArrowUpRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Step {
  description: string;
  link?: { href: string; label: string };
  title: string;
}

const steps: Step[] = [
  {
    description: 'Set up config and install dependencies with a single command.',
    link: { href: '/docs/cli', label: 'useverse CLI docs' },
    title: 'Initialize your project'
  },
  {
    description: 'Pull any hook straight into your codebase — fully typed, no black box.',
    title: 'Add the hooks you need'
  },
  {
    description: 'Import and start using the hook right away — no extra wiring.',
    title: 'Use it in your code'
  }
];

type LineKind = 'command' | 'output';

interface Segment {
  className?: string;
  text: string;
}

interface ScriptLine {
  id: string;
  kind: LineKind;
  segments: Segment[];
}

const text = (value: string): Segment[] => [{ text: value }];

const script: ScriptLine[] = [
  {
    id: 'init-command',
    kind: 'command',
    segments: [
      { className: 'text-zinc-500', text: '~/my-app $ ' },
      { className: 'text-zinc-950 dark:text-white', text: 'npx useverse@latest init' }
    ]
  },
  {
    id: 'created-config',
    kind: 'output',
    segments: [
      { className: 'text-zinc-950 dark:text-white', text: '✓ ' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: 'Created ' },
      { className: 'text-cyan-600 dark:text-cyan-400', text: 'reactuse.json' }
    ]
  },
  {
    id: 'installed-dependencies',
    kind: 'output',
    segments: [
      { className: 'text-zinc-950 dark:text-white', text: '✓ ' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: 'Installed dependencies' }
    ]
  },
  { id: 'space-after-init', kind: 'output', segments: text('') },
  {
    id: 'add-command',
    kind: 'command',
    segments: [
      { className: 'text-zinc-500', text: '~/my-app $ ' },
      { className: 'text-zinc-950 dark:text-white', text: 'npx useverse@latest add useCounter' }
    ]
  },
  {
    id: 'resolved-hook',
    kind: 'output',
    segments: [
      { className: 'text-zinc-950 dark:text-white', text: '✓ ' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: 'Resolved ' },
      { className: 'text-violet-600 dark:text-violet-400', text: 'useCounter' }
    ]
  },
  {
    id: 'added-hook-file',
    kind: 'output',
    segments: [
      { className: 'text-zinc-950 dark:text-white', text: '✓ ' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: 'Added ' },
      { className: 'text-cyan-600 dark:text-cyan-400', text: 'hooks/useCounter.ts' }
    ]
  },
  { id: 'space-after-add', kind: 'output', segments: text('') },
  {
    id: 'usage-comment',
    kind: 'output',
    segments: [{ className: 'text-zinc-500', text: '// use it in your component' }]
  },
  {
    id: 'usage-import',
    kind: 'output',
    segments: [
      { className: 'text-violet-600 dark:text-violet-400', text: 'import ' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: '{ ' },
      { className: 'text-cyan-600 dark:text-cyan-400', text: 'useCounter' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: ' } ' },
      { className: 'text-violet-600 dark:text-violet-400', text: 'from ' },
      { className: 'text-amber-600 dark:text-amber-300', text: "'@/hooks'" }
    ]
  },
  {
    id: 'usage-call',
    kind: 'output',
    segments: [
      { className: 'text-violet-600 dark:text-violet-400', text: 'const ' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: '{ ' },
      { className: 'text-cyan-600 dark:text-cyan-400', text: 'count, inc' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: ' } = ' },
      { className: 'text-zinc-950 dark:text-white', text: 'useCounter' },
      { className: 'text-zinc-700 dark:text-zinc-300', text: '()' }
    ]
  }
];

const TYPE_SPEED = 55; // ms per char (slower)
const OUTPUT_DELAY = 500; // ms before an output line appears

const segmentsToText = (segments: Segment[]) => segments.map((s) => s.text).join('');

export const LandingCli = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [started, setStarted] = useState(false);

  const { ref } = useVisibility<HTMLElement>({
    threshold: 0.35,
    enabled: !started,
    onChange: (entry) => {
      if (entry.isIntersecting) setStarted(true);
    }
  });

  // sequential terminal player — runs once, then stops
  useEffect(() => {
    if (!started) return;
    if (lineIndex >= script.length) return;

    const line = script[lineIndex];

    if (line.kind === 'command') {
      const full = segmentsToText(line.segments);

      if (charCount < full.length) {
        const timer = setTimeout(() => setCharCount((c) => c + 1), TYPE_SPEED);

        return () => clearTimeout(timer);
      }

      const next = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharCount(0);
      }, OUTPUT_DELAY);

      return () => clearTimeout(next);
    }

    const next = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharCount(0);
    }, OUTPUT_DELAY);

    return () => clearTimeout(next);
  }, [started, lineIndex, charCount]);

  // render a command line respecting the typed char count (preserves colors)
  const renderTypedSegments = (segments: Segment[], count: number) => {
    let remaining = count;

    return segments.map((segment) => {
      if (remaining <= 0) return null;
      const slice = segment.text.slice(0, remaining);
      remaining -= segment.text.length;

      return (
        <span key={`${segment.className ?? 'plain'}-${segment.text}`} className={segment.className}>
          {slice}
        </span>
      );
    });
  };

  return (
    <section ref={ref}>
      <div className='container mx-auto px-6 pb-12 md:pb-24'>
        <h2 className='font-display text-foreground text-xl font-bold tracking-tight uppercase md:text-2xl'>
          or install by cli
        </h2>

        <div className='mt-4 grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          {/* ── Steps (left) — big numerals ── */}
          <motion.ol
            className='flex flex-col gap-8'
            initial={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {steps.map((step, index) => (
              <li
                key={step.title}
                className='flex items-start gap-6 transition-opacity duration-500'
              >
                <span className='font-display text-foreground shrink-0 text-5xl font-bold tracking-tight tabular-nums transition-colors md:text-6xl'>
                  0{index + 1}
                </span>
                <div className='min-w-0 pt-1'>
                  <h3 className='text-foreground text-xl font-semibold tracking-tight md:text-2xl'>
                    {step.title}
                  </h3>
                  <p className='text-muted-foreground mt-2 leading-relaxed'>
                    {step.description}
                    {step.link && (
                      <>
                        <Link
                          className='text-foreground inline-flex items-center gap-0.5 font-medium underline underline-offset-4'
                          href={step.link.href}
                          prefetch={false}
                          rel='noreferrer'
                          target='_blank'
                        >
                          {step.link.label}
                          <ArrowUpRightIcon className='size-4' />
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </motion.ol>

          {/* ── Terminal (right) — right-side fade ── */}
          <motion.div
            className='border-border bg-card relative overflow-hidden rounded-xl border dark:bg-[#0a0a0a]'
            initial={{ opacity: 0, scale: 0.97, y: -30 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
          >
            {/* title bar */}
            <div className='border-border flex items-center gap-2 border-b px-4 py-3 dark:border-white/10'>
              <span className='bg-muted-foreground/30 size-3 rounded-full dark:bg-white/20' />
              <span className='bg-muted-foreground/30 size-3 rounded-full dark:bg-white/20' />
              <span className='bg-muted-foreground/30 size-3 rounded-full dark:bg-white/20' />
              <span className='text-muted-foreground ml-2 font-mono text-xs tracking-wide'>
                zsh — useverse
              </span>
            </div>

            {/* body */}
            <div className='relative h-80 overflow-hidden px-5 py-4 font-mono text-sm leading-relaxed'>
              <div>
                {started &&
                  script.slice(0, lineIndex + 1).map((line) => {
                    const isCurrent = line.id === script[lineIndex]?.id;
                    const isTyping = isCurrent && line.kind === 'command';
                    const full = segmentsToText(line.segments);

                    return (
                      <div key={line.id} className='whitespace-pre'>
                        {isTyping ? (
                          <>
                            {renderTypedSegments(line.segments, charCount)}
                            {charCount < full.length && (
                              <span className='landing-cli-cursor text-foreground dark:text-white'>
                                ▋
                              </span>
                            )}
                          </>
                        ) : line.segments.length === 1 && line.segments[0].text === '' ? (
                          '\u00A0'
                        ) : (
                          line.segments.map((segment) => (
                            <span
                              key={`${segment.className ?? 'plain'}-${segment.text}`}
                              className={segment.className}
                            >
                              {segment.text}
                            </span>
                          ))
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* right-side fade */}
              <div className='from-card pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l to-transparent dark:from-[#0a0a0a]' />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes landing-cli-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .landing-cli-cursor {
          animation: landing-cli-cursor 1s steps(1) infinite;
        }
      `}</style>
    </section>
  );
};
