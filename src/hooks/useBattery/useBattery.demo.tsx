import React from 'react';

import { useBattery } from './useBattery';

const Demo = () => {
  const battery = useBattery();

  if (!battery.isSupported) {
    return (
      <div>
        <strong>Battery sensor</strong>: <span>not supported</span>
      </div>
    );
  }

  if (!battery.loading) {
    return (
      <div>
        <strong>Battery sensor</strong>: <span>supported</span> <br />
        <strong>Battery state</strong>: <span>fetching</span>
      </div>
    );
  }

  return (
    <div>
      <span>Battery sensor: {battery.isSupported && 'supported'}</span> <br />
      <span>Battery state: {battery.loading && 'loaded'}</span> <br />
      <span>Charge level: {battery.level && (battery.level * 100).toFixed(0)}%</span> <br />
      <span>Charging: {battery.charging ? 'yes' : 'no'}</span> <br />
      <span>Charging time: {battery.chargingTime ? battery.chargingTime : 'finished'}</span> <br />
      <span>
        Discharging time: {battery.dischargingTime ? battery.dischargingTime : 'never'}
      </span>{' '}
      <br />
    </div>
  );
};

export default Demo;
