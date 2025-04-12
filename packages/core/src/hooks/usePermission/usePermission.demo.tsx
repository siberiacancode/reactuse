import { usePermission } from '@siberiacancode/reactuse';

const Demo = () => {
  const accelerometer = usePermission('accelerometer');
  const accessibilityEvents = usePermission('accessibility-events');
  const ambientLightSensor = usePermission('ambient-light-sensor');
  const backgroundSync = usePermission('background-sync');
  const camera = usePermission('camera');
  const clipboardRead = usePermission('clipboard-read');
  const clipboardWrite = usePermission('clipboard-write');
  const gyroscope = usePermission('gyroscope');
  const magnetometer = usePermission('magnetometer');
  const microphone = usePermission('microphone');
  const notifications = usePermission('notifications');
  const paymentHandler = usePermission('payment-handler');
  const persistentStorage = usePermission('persistent-storage');
  const push = usePermission('push');
  const speaker = usePermission('speaker');

  return (
    <>
      <p>
        accelerometer: <code>{accelerometer.state}</code>
      </p>
      <p>
        accessibilityEvents: <code>{accessibilityEvents.state}</code>
      </p>
      <p>
        ambientLightSensor: <code>{ambientLightSensor.state}</code>
      </p>
      <p>
        backgroundSync: <code>{backgroundSync.state}</code>
      </p>
      <p>
        camera: <code>{camera.state}</code>
      </p>
      <p>
        clipboardRead: <code>{clipboardRead.state}</code>
      </p>
      <p>
        clipboardWrite: <code>{clipboardWrite.state}</code>
      </p>
      <p>
        gyroscope: <code>{gyroscope.state}</code>
      </p>
      <p>
        magnetometer: <code>{magnetometer.state}</code>
      </p>
      <p>
        microphone: <code>{microphone.state}</code>
      </p>
      <p>
        notifications: <code>{notifications.state}</code>
      </p>
      <p>
        paymentHandler: <code>{paymentHandler.state}</code>
      </p>
      <p>
        persistentStorage: <code>{persistentStorage.state}</code>
      </p>
      <p>
        push: <code>{push.state}</code>
      </p>
      <p>
        speaker: <code>{speaker.state}</code>
      </p>
    </>
  );
};

export default Demo;
