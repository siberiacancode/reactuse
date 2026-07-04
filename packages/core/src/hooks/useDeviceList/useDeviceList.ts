import { useEffect, useRef, useState } from 'react';

/** The use device list callback type */
export type UseDeviceListCallback = (devices: MediaDeviceInfo[]) => void;

/** The use device list options type */
export interface UseDeviceListOptions {
  /** Whether the device list should be requested immediately */
  immediately?: boolean;
  /** The callback fired when the device list updates */
  onUpdate?: UseDeviceListCallback;
}

/** The use device list return type */
export interface UseDeviceListReturn {
  /** The available audio input devices (microphones) */
  audioInputs: MediaDeviceInfo[];
  /** The available audio output devices (speakers) */
  audioOutputs: MediaDeviceInfo[];
  /** All available media devices */
  devices: MediaDeviceInfo[];
  /** Whether `mediaDevices.enumerateDevices` is supported by the browser */
  supported: boolean;
  /** The available video input devices (cameras) */
  videoInputs: MediaDeviceInfo[];
  /** Request permissions for media devices and re-read the available device list */
  trigger: () => Promise<MediaDeviceInfo[]>;
  /** Re-read the list of available devices */
  update: () => Promise<MediaDeviceInfo[]>;
}

export interface UseDeviceList {
  (callback?: UseDeviceListCallback): UseDeviceListReturn;

  (options?: UseDeviceListOptions): UseDeviceListReturn;
}

/**
 * @name useDeviceList
 * @description - Hook that returns the list of available media devices
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.mediaDevices.enumerateDevices https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
 *
 * @overload
 * @param {(devices: MediaDeviceInfo[]) => void} [callback] The callback fired when the device list updates
 * @returns {UseDeviceListReturn} An object containing the available devices
 *
 * @example
 * const { devices, videoInputs, audioInputs, audioOutputs, update, trigger } = useDeviceList((devices) => console.log(devices));
 *
 * @overload
 * @param {boolean} [options.immediately=true] Whether the device list should be requested immediately
 * @param {(devices: MediaDeviceInfo[]) => void} [options.onUpdate] The callback fired when the device list updates
 * @returns {UseDeviceListReturn} An object containing the available devices
 *
 * @example
 * const { devices, videoInputs, audioInputs, audioOutputs, update, trigger } = useDeviceList({ immediately: true });
 */
export const useDeviceList = ((...params: any[]) => {
  const options = (typeof params[0] === 'function' ? { onUpdate: params[0] } : params[0]) as
    | UseDeviceListOptions
    | undefined;

  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'enumerateDevices' in navigator.mediaDevices &&
    !!navigator.mediaDevices.enumerateDevices;

  const immediately = options?.immediately ?? true;

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const update = async () => {
    if (!supported) return;

    const list = await navigator.mediaDevices.enumerateDevices();

    setDevices(list);
    optionsRef.current?.onUpdate?.(list);
    return list;
  };

  const trigger = async () => {
    if (!supported) return;

    const list = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = list.some((device) => device.kind === 'videoinput');
    const hasMicrophone = list.some((device) => device.kind === 'audioinput');
    if (!hasCamera && !hasMicrophone) return update();

    const stream = await navigator.mediaDevices.getUserMedia({
      video: hasCamera,
      audio: hasMicrophone
    });

    stream?.getTracks().forEach((track) => track.stop());

    setDevices(list);
    optionsRef.current?.onUpdate?.(list);
    return list;
  };

  useEffect(() => {
    if (!supported) return;
    if (immediately) trigger();

    navigator.mediaDevices.addEventListener('devicechange', update);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', update);
    };
  }, []);

  return {
    trigger,
    devices,
    videoInputs: devices.filter((device) => device.kind === 'videoinput'),
    audioInputs: devices.filter((device) => device.kind === 'audioinput'),
    audioOutputs: devices.filter((device) => device.kind === 'audiooutput'),
    supported,
    update
  };
}) as UseDeviceList;
