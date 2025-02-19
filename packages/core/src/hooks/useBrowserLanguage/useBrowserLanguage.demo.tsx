import { useBrowserLanguage } from './useBrowserLanguage';

const Demo = () => {
  const browserLanguage = useBrowserLanguage();

  return (
    <p>
      Browser language: <code>{browserLanguage}</code>
    </p>
  );
};

export default Demo;
