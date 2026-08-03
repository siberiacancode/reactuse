export const CONFIG = {
  NAME: 'reactuse',
  ALGOLIA: {
    APP_ID: '2XW3QY934Y',
    API_KEY: '7c74db842718595073b9240c1eb1949f',
    INDEX_NAME: 'reactuse'
  },
  URL: 'https://reactuse.org',
  DESCRIPTION: 'Improve your react applications with our library 📦 designed for comfort and speed',
  SOURCE: (name: string, type = 'ts') =>
    `https://github.com/siberiacancode/reactuse/blob/main/packages/core/src/hooks/${name}/${name}.${type}`
};
