import { useOperatingSystem } from './useOperatingSystem';

const Demo = () => {
  const operatingSystem = useOperatingSystem();
  return (
    <p>
      Your os is <code>{operatingSystem}</code>
    </p>
  );
};

export default Demo;
