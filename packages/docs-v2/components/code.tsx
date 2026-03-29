import { highlightCode } from '@/lib/highlight-code';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';

interface Props {
  code: string;
}

export const Code = async (props: Props) => {
  const html = await highlightCode(props.code);

  return (
    <CodeBlock
      keepBackground
      className='bg-[var(--color-code)] border-none'
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </CodeBlock>
  );
};
