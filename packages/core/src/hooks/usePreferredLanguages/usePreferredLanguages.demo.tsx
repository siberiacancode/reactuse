import { usePreferredLanguages } from '@siberiacancode/reactuse';

const Demo = () => {
  const languages = usePreferredLanguages();

  return (
    <ul>
      {languages.map((language) => (
        <li key={language}>
          <code>{language}</code> locale date -{' '}
          <code>
            <time>{new Date(Date.now()).toLocaleDateString(language)}</time>
          </code>
        </li>
      ))}
    </ul>
  );
};

export default Demo;
