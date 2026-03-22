import { siteConfig } from './config';
import { HookProps } from './parse-hook';
import { getApiParamsTableUI, getContributorsUI, getWarningUI } from '@/components/mdx-content';

const getExamples = (examples: string[]) =>
  examples.map((example) => ` \`\`\`tsx \n ${example} \n \`\`\` `).join('\n');

export const mdxContent = (componentName: string, props: HookProps) => `---
  title: ${componentName}
  description: ${props.description}
---

<div className="flex gap-3">
  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
    ${props.category}
  </Badge>
  <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
    ${props.usage}
  </Badge>
  <Badge className="${
    props.hasTests
      ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
      : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
  }">
    test coverage
  </Badge>
</div>

${getWarningUI(props.warning)}

<Separator className="my-8"/>

## Installation

\`\`\`bash
npx useverse@latest add ${componentName}
\`\`\`

<Separator className="my-8"/>

## Usage

${getExamples(props.examples)}

<Separator className="my-8"/>

## Demo

TODO

<Separator className="my-8"/>

## Api

${getApiParamsTableUI(props.apiParameters)}

<Separator className="my-8"/>

## Type declaration

TODO

## Source

[Source](${siteConfig.source(componentName)})
[Demo](${siteConfig.source(componentName, 'demo.tsx')})

<Separator className="my-8"/>

## Contributors
  ${getContributorsUI(props.contributors)}
`;
