import { highlightCode } from '@docs/lib/highlight-code';
import { CodeBlock } from 'fumadocs-ui/components/codeblock';

interface Props {
  code: string;
}

export const Code = async (props: Props) => {
  const html = await highlightCode(props.code);

  return (
    <CodeBlock keepBackground className='border-none bg-[var(--color-code)]'>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </CodeBlock>
  );
};
