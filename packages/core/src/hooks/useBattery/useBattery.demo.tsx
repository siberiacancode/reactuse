import { useBattery } from '@siberiacancode/reactuse';

const Demo = () => {
  const battery = useBattery();

  if (!battery.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  if (battery.value.loading) {
    return (
      <p>
        Battery state: <code>fetching</code>
      </p>
    );
  }

  return (
    <>
      <p>
        Charge level: <code>{battery.value.level && (battery.value.level * 100).toFixed(0)}%</code>
      </p>
      <p>
        Charging: <code>{battery.value.charging ? 'yes' : 'no'}</code>
      </p>
      <p>
        Charging time:{' '}
        <code>{battery.value.chargingTime ? battery.value.chargingTime : 'finished'}</code>
      </p>
      <p>
        Discharging time:{' '}
        <code>{battery.value.dischargingTime ? battery.value.dischargingTime : 'never'}</code>
      </p>
    </>
  );
};

export default Demo;
