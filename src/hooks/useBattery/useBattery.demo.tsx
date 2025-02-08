import { useBattery } from './useBattery';

const Demo = () => {
  const battery = useBattery();

  if (!battery.supported) {
    return (
      <p>
        Battery sensor:
        <code>not supported</code>
      </p>
    );
  }

  if (battery.value.loading) {
    return (
      <>
        <p>
          Battery sensor: <code>supported</code>
        </p>
        <p>
          Battery state: <code>fetching</code>
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        Battery sensor: <code>{battery.supported && 'supported'}</code>
      </p>
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
