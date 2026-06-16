'use client'

import { useClickOutside, useDisclosure, useField, useFileDialog } from '@siberiacancode/reactuse';
import {
  FileImageIcon,
  FileTextIcon,
  PaperclipIcon,
  SendHorizontalIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.txt', '.doc', '.docx', '.zip', 'json', 'yaml'];

const isAllowedFile = (fileName: string) => {
  const normalizedFileName = fileName.toLowerCase();
  return ALLOWED_FILE_EXTENSIONS.some((extension) => normalizedFileName.endsWith(extension));
};

const ATTACHMENT_ICONS = {
  image: FileImageIcon,
  file: FileTextIcon
};

const Demo = () => {
  const attachMenu = useDisclosure();
  const attachMenuRef = useClickOutside<HTMLDivElement>(() => attachMenu.close());

  const toField = useField('siberiacancode@reactuse.org');
  const subjectField = useField('Improve Reactuse documentation 🚀');
  const messageField = useField(
    'Added examples and notes for the docs update.\n\nLet us improve Reactuse documentation.'
  );

  const [attachments, setAttachments] = useState<File[]>([]);

  const addImageAttachments = (files: FileList | null) => {
    if (!files?.length) return;
    const nextFiles = [...files].filter((file) => file.type.startsWith('image/'));
    if (!nextFiles.length) return;
    setAttachments((prevFiles) => [...prevFiles, ...nextFiles]);
  };

  const addFileAttachments = (files: FileList | null) => {
    if (!files?.length) return;
    const nextFiles = [...files].filter((file) => isAllowedFile(file.name));
    if (!nextFiles.length) return;
    setAttachments((prevFiles) => [...prevFiles, ...nextFiles]);
  };

  const imageDialog = useFileDialog(addImageAttachments, {
    multiple: true,
    accept: 'image/*',
    reset: true
  });

  const fileDialog = useFileDialog(addFileAttachments, {
    multiple: true,
    accept: '.pdf,.txt,.doc,.docx,.zip,.json,.yaml',
    reset: true
  });

  const onRemoveAttachment = (index: number) =>
    setAttachments((prevFiles) => prevFiles.filter((_, fileIndex) => fileIndex !== index));

  return (
    <section className='flex w-full max-w-xl flex-col'>
      <div className='bg-card overflow-hidden rounded-2xl p-4 shadow-sm'>
        <div className='px-4 py-3'>
          <h3 className='text-sm font-semibold'>Compose</h3>
        </div>

        <div className='flex items-center gap-2 px-4 py-2.5'>
          <span className='text-muted-foreground w-14 shrink-0 text-xs'>To</span>
          <input
            className='text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none'
            placeholder='you@example.com'
            {...toField.register()}
          />
        </div>

        <div className='flex items-center gap-2 px-4 py-2.5'>
          <span className='text-muted-foreground w-14 shrink-0 text-xs'>Subject</span>
          <input
            className='text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none'
            id='subject'
            placeholder='Write a clear subject'
            {...subjectField.register()}
          />
        </div>

        <div className='px-4 py-3'>
          <textarea
            className='text-foreground placeholder:text-muted-foreground no-scrollbar min-h-[140px] w-full resize-none bg-transparent text-sm leading-relaxed outline-none'
            id='description'
            placeholder='Add your message...'
            rows={8}
            {...messageField.register()}
          />
        </div>

        {!!attachments.length && (
          <div className='px-4 py-3'>
            <div className='flex flex-wrap gap-2'>
              {attachments.map((file, index) => {
                const Icon = ATTACHMENT_ICONS[file.type.startsWith('image/') ? 'image' : 'file'];

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className='border-border bg-muted/60 flex w-full max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-xs md:w-auto'
                  >
                    <Icon className='text-muted-foreground size-3.5 shrink-0' />
                    <span className='max-w-44 truncate'>{file.name}</span>
                    <button
                      aria-label={`Remove ${file.name}`}
                      className='text-muted-foreground hover:text-foreground inline-flex items-center justify-center'
                      data-variant='ghost'
                      type='button'
                      onClick={() => onRemoveAttachment(index)}
                    >
                      <XIcon className='size-3.5' />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className='bg-card/80 flex items-center justify-between px-4 py-3'>
          <div ref={attachMenuRef} className='relative'>
            <button data-variant='ghost' type='button' onClick={() => attachMenu.toggle()}>
              <PaperclipIcon className='size-4' />
              Attach
            </button>

            {attachMenu.opened && (
              <div
                className='absolute bottom-11 left-0 z-10 w-44'
                data-slot='dropdown-menu-content'
              >
                <div
                  data-slot='dropdown-menu-item'
                  onClick={() => {
                    imageDialog.open();
                    attachMenu.close();
                  }}
                >
                  <FileImageIcon />
                  Image
                </div>
                <div
                  data-slot='dropdown-menu-item'
                  onClick={() => {
                    fileDialog.open();
                    attachMenu.close();
                  }}
                >
                  <FileTextIcon />
                  File
                </div>
              </div>
            )}
          </div>

          <button type='button'>
            <SendHorizontalIcon className='size-4' />
            Send
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
