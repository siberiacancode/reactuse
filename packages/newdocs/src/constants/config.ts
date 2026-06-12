export const CONFIG = {
  NAME: 'reactuse',
  ALGOLIA: {
    APP_ID: '62LROXAB1F',
    API_KEY: '87ab8dd07b4aba02814c082d98e4b8a7',
    INDEX_NAME: 'reactuse'
  },
  URL: 'https://reactuse.org',
  DESCRIPTION: 'Improve your react applications with our library 📦 designed for comfort and speed',
  SOURCE: (name: string, type = 'ts') =>
    `https://github.com/siberiacancode/reactuse/blob/main/packages/core/src/hooks/${name}/${name}.${type}`
};
