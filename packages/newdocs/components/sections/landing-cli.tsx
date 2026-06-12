'use client';

import { ArrowUpRightIcon } from 'lucide-react';
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
  kind: LineKind;
  segments: Segment[];
}

const text = (value: string): Segment[] => [{ text: value }];

const script: ScriptLine[] = [
  {
    kind: 'command',
    segments: [
      { className: 'text-zinc-500', text: '~/my-app $ ' },
      { className: 'text-white', text: 'npx useverse@latest init' }
    ]
  },
  {
    kind: 'output',
    segments: [
      { className: 'text-emerald-400', text: '✓ ' },
      { className: 'text-zinc-300', text: 'Created ' },
      { className: 'text-cyan-400', text: 'reactuse.json' }
    ]
  },
  {
    kind: 'output',
    segments: [
      { className: 'text-emerald-400', text: '✓ ' },
      { className: 'text-zinc-300', text: 'Installed dependencies' }
    ]
  },
  { kind: 'output', segments: text('') },
  {
    kind: 'command',
    segments: [
      { className: 'text-zinc-500', text: '~/my-app $ ' },
      { className: 'text-white', text: 'npx useverse@latest add useCounter' }
    ]
  },
  {
    kind: 'output',
    segments: [
      { className: 'text-emerald-400', text: '✓ ' },
      { className: 'text-zinc-300', text: 'Resolved ' },
      { className: 'text-violet-400', text: 'useCounter' }
    ]
  },
  {
    kind: 'output',
    segments: [
      { className: 'text-emerald-400', text: '✓ ' },
      { className: 'text-zinc-300', text: 'Added ' },
      { className: 'text-cyan-400', text: 'hooks/useCounter.ts' }
    ]
  },
  { kind: 'output', segments: text('') },
  {
    kind: 'output',
    segments: [{ className: 'text-zinc-500', text: '// use it in your component' }]
  },
  {
    kind: 'output',
    segments: [
      { className: 'text-violet-400', text: 'import ' },
      { className: 'text-zinc-300', text: '{ ' },
      { className: 'text-cyan-400', text: 'useCounter' },
      { className: 'text-zinc-300', text: ' } ' },
      { className: 'text-violet-400', text: 'from ' },
      { className: 'text-amber-300', text: "'@/hooks'" }
    ]
  },
  {
    kind: 'output',
    segments: [
      { className: 'text-violet-400', text: 'const ' },
      { className: 'text-zinc-300', text: '{ ' },
      { className: 'text-cyan-400', text: 'count, inc' },
      { className: 'text-zinc-300', text: ' } = ' },
      { className: 'text-emerald-400', text: 'useCounter' },
      { className: 'text-zinc-300', text: '()' }
    ]
  }
];

const TYPE_SPEED = 55; // ms per char (slower)
const OUTPUT_DELAY = 500; // ms before an output line appears

const segmentsToText = (segments: Segment[]) => segments.map((s) => s.text).join('');

export const LandingCli = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // sequential terminal player — runs once, then stops
  useEffect(() => {
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
  }, [lineIndex, charCount]);

  // render a command line respecting the typed char count (preserves colors)
  const renderTypedSegments = (segments: Segment[], count: number) => {
    let remaining = count;

    return segments.map((segment, index) => {
      if (remaining <= 0) return null;
      const slice = segment.text.slice(0, remaining);
      remaining -= segment.text.length;

      return (
        <span key={index} className={segment.className}>
          {slice}
        </span>
      );
    });
  };

  return (
    <section>
      <div className='mx-auto max-w-6xl px-6 py-12 md:py-24'>
        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          {/* ── Steps (left) — big numerals ── */}
          <ol className='flex flex-col gap-8'>
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
          </ol>

          {/* ── Terminal (right) — right-side fade ── */}
          <div className='border-border relative overflow-hidden rounded-xl border bg-[#0a0a0a]'>
            {/* title bar */}
            <div className='flex items-center gap-2 border-b border-white/10 px-4 py-3'>
              <span className='size-3 rounded-full bg-white/20' />
              <span className='size-3 rounded-full bg-white/20' />
              <span className='size-3 rounded-full bg-white/20' />
              <span className='ml-2 font-mono text-xs tracking-wide text-white/40'>
                zsh — useverse
              </span>
            </div>

            {/* body */}
            <div className='relative h-80 overflow-hidden px-5 py-4 font-mono text-sm leading-relaxed'>
              <div>
                {script.slice(0, lineIndex + 1).map((line, index) => {
                  const isCurrent = index === lineIndex;
                  const isTyping = isCurrent && line.kind === 'command';
                  const full = segmentsToText(line.segments);

                  return (
                    <div key={index} className='whitespace-pre'>
                      {isTyping ? (
                        <>
                          {renderTypedSegments(line.segments, charCount)}
                          {charCount < full.length && (
                            <span className='landing-cli-cursor text-white'>▋</span>
                          )}
                        </>
                      ) : line.segments.length === 1 && line.segments[0].text === '' ? (
                        '\u00A0'
                      ) : (
                        line.segments.map((segment, segmentIndex) => (
                          <span key={segmentIndex} className={segment.className}>
                            {segment.text}
                          </span>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>

              {/* right-side fade */}
              <div className='pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent' />
            </div>
          </div>
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
