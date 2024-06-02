import { usePreferredLanguages } from './usePreferredLanguages';

const Demo = () => {
  const languages = usePreferredLanguages();

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat(languages).format(date);

  return (
    <div>
      <p>FormattedDate: {formattedDate}</p>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
    </div>
  );
};

export default Demo;
