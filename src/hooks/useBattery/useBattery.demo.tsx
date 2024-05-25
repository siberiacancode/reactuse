import React from 'react';

import { useBattery } from './useBattery';

const Demo = () => {
  const battery = useBattery();

  if (!battery.supported) {
    return (
      <div>
        <strong>Battery sensor</strong>: <div>not supported</div>
      </div>
    );
  }

  if (!battery.loading) {
    return (
      <div>
        <strong>Battery sensor</strong>: <div>supported</div>
        <strong>Battery state</strong>: <div>fetching</div>
      </div>
    );
  }

  return (
    <div>
      <div>Battery sensor: {battery.supported && 'supported'}</div>
      <div>Battery state: {battery.loading && 'loaded'}</div>
      <div>Charge level: {battery.level && (battery.level * 100).toFixed(0)}%</div>
      <div>Charging: {battery.charging ? 'yes' : 'no'}</div>
      <div>Charging time: {battery.chargingTime ? battery.chargingTime : 'finished'}</div>
      <div>Discharging time: {battery.dischargingTime ? battery.dischargingTime : 'never'}</div>
    </div>
  );
};

export default Demo;
