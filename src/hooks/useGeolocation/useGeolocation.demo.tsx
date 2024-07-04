import { useGeolocation } from './useGeolocation';

const Demo = () => {
  const geolocation = useGeolocation();

  return (
    <p>
      <pre>{JSON.stringify(geolocation, null, 2)}</pre>
    </p>
  );
};

export default Demo;
