import { useBattery } from './useBattery';

const Demo = () => {
  const battery = useBattery();

  if (!battery.supported) {
    return (
      <div>
        <strong>Battery sensor</strong>:
        <div>
          <code>not supported</code>
        </div>
      </div>
    );
  }

  if (!battery.loading) {
    return (
      <div>
        <strong>Battery sensor</strong>:
        <div>
          <code>supported</code>
        </div>
        <strong>Battery state</strong>:
        <div>
          <code>fetching</code>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        Battery sensor: <code>{battery.supported && 'supported'}</code>
      </div>
      <div>
        Battery state: <code>{battery.loading && 'loaded'}</code>
      </div>
      <div>
        Charge level: <code>{battery.level && (battery.level * 100).toFixed(0)}%</code>
      </div>
      <div>
        Charging: <code>{battery.charging ? 'yes' : 'no'}</code>
      </div>
      <div>
        Charging time: <code>{battery.chargingTime ? battery.chargingTime : 'finished'}</code>
      </div>
      <div>
        Discharging time: <code>{battery.dischargingTime ? battery.dischargingTime : 'never'}</code>
      </div>
    </div>
  );
};

export default Demo;
