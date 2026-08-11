import { ChatgptIcon, ClaudeIcon, SciraIcon, V0Icon } from '@/src/components/icons';

export const PROMPT_LINKS = {
  v0: {
    Icon: <V0Icon />,
    title: 'Open in v0',
    url: 'https://v0.dev'
  },
  chatgpt: {
    Icon: <ChatgptIcon />,
    title: 'Open in ChatGPT',
    url: 'https://chatgpt.com'
  },
  claude: {
    Icon: <ClaudeIcon />,
    title: 'Open in Claude',
    url: 'https://claude.ai/new'
  },
  scira: {
    Icon: <SciraIcon />,
    title: 'Open in Scira',
    url: 'https://scira.ai/'
  }
};
