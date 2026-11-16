'use client'

import { useTextSelection } from '@siberiacancode/reactuse';
import { HighlighterIcon, XIcon } from 'lucide-react';
import { useRef, useState } from 'react';

const PARAGRAPHS = [
  'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API.',
  'Every hook follows the same shape, so once you learn one you already know the rest. Options go in, a small object comes out, and the ref is always there when you need it.',
  'Select any sentence in this text and press the highlight button. The passage will be marked and saved to your notes on the side, just like in a reading app.',
  'Highlights are stored as you make them. The notes panel keeps every passage you mark, and you can remove any of them later — the highlight in the text disappears too.'
];

interface Note {
  id: number;
  marks: HTMLElement[];
  text: string;
}

const Demo = () => {
  const articleRef = useRef<HTMLElement | null>(null);

  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  const textSelection = useTextSelection(({ text, rects, ranges }) => {
    const range = ranges[0];

    if (text.trim().length === 0 || !range) {
      setPosition(null);
      return;
    }

    const anchor =
      range.startContainer.nodeType === Node.TEXT_NODE
        ? range.startContainer.parentElement
        : (range.startContainer as Element);

    if (!anchor || !articleRef.current?.contains(anchor)) {
      setPosition(null);
      return;
    }

    const rect = rects.find((r) => r.width > 0) ?? range.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      setPosition(null);
      return;
    }

    setPosition({ left: rect.left + rect.width / 2, top: rect.top });
  });

  const getTextNodesInRange = (range: Range) => {
    const root = range.commonAncestorContainer;

    if (root.nodeType === Node.TEXT_NODE) {
      return range.intersectsNode(root) && root.textContent?.trim() ? [root as Text] : [];
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];

    let current = walker.nextNode();
    while (current) {
      if (range.intersectsNode(current) && current.textContent?.trim()) {
        textNodes.push(current as Text);
      }
      current = walker.nextNode();
    }

    return textNodes;
  };

  const onHighlight = () => {
    const range = textSelection.ranges[0];
    const text = textSelection.text.trim();
    if (!range || !text) return;

    const marks: HTMLElement[] = [];
    const textNodes = getTextNodesInRange(range);

    for (const node of textNodes) {
      if (node.parentElement?.tagName === 'MARK') continue;

      const nodeRange = document.createRange();
      nodeRange.selectNodeContents(node);
      if (node === range.startContainer) nodeRange.setStart(node, range.startOffset);
      if (node === range.endContainer) nodeRange.setEnd(node, range.endOffset);
      if (nodeRange.toString().trim().length === 0) continue;

      const mark = document.createElement('mark');
      mark.className = 'bg-yellow-300/40 text-foreground rounded px-0.5';
      try {
        nodeRange.surroundContents(mark);
        marks.push(mark);
      } catch {
        // skip fragments that can't be wrapped cleanly
      }
    }

    if (marks.length > 0) {
      setNotes((prev) => [{ id: Date.now(), marks, text }, ...prev]);
    }

    textSelection.selection?.removeAllRanges();
    setPosition(null);
  };

  const onRemoveNote = (note: Note) => {
    for (const mark of note.marks) {
      const parent = mark.parentNode;
      if (!parent) continue;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parent.normalize();
    }
    setNotes((prev) => prev.filter((item) => item.id !== note.id));
  };

  return (
    <section className='flex w-full max-w-2xl items-stretch gap-4 p-4'>
      <article ref={articleRef} className='flex flex-1 flex-col gap-4'>
        {PARAGRAPHS.map((text, index) => (
          <p key={index} className='text-foreground text-base leading-relaxed select-text'>
            {text}
          </p>
        ))}
      </article>

      <aside className='border-border relative w-56 shrink-0 border-l pl-4'>
        <div className='absolute inset-y-0 right-0 left-4 flex flex-col overflow-hidden'>
          <div className='mb-3 flex shrink-0 items-center gap-1.5'>
            <HighlighterIcon className='text-muted-foreground size-4' />
            <span className='text-foreground text-sm font-medium'>My notes</span>
            {!!notes.length && (
              <span className='text-muted-foreground text-xs tabular-nums'>{notes.length}</span>
            )}
          </div>

          {!notes.length && (
            <p className='text-muted-foreground text-xs leading-relaxed'>
              Select text and highlight it to save a note here.
            </p>
          )}

          {!!notes.length && (
            <ul className='no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1'>
              {notes.map((note) => (
                <li
                  key={note.id}
                  className='bg-muted/50 group relative shrink-0 rounded-lg p-2 pr-7 text-xs leading-relaxed'
                >
                  <span className='text-foreground border-l-2 border-yellow-400 pl-2'>
                    {note.text}
                  </span>
                  <button
                    aria-label='Remove note'
                    className='absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100'
                    data-size='icon-xs'
                    data-variant='ghost'
                    type='button'
                    onClick={() => onRemoveNote(note)}
                  >
                    <XIcon className='size-3' />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {position && (
        <button
          className='fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+8px)]'
          data-size='sm'
          style={{ left: position.left, top: position.top }}
          type='button'
          onClick={onHighlight}
          onMouseDown={(event) => event.preventDefault()}
        >
          <HighlighterIcon className='size-3.5' />
          Highlight
        </button>
      )}
    </section>
  );
};

export default Demo;
