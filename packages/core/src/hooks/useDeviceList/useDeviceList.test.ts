import { act, renderHook, waitFor } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useDeviceList } from './useDeviceList';

const trigger = createTrigger<'devicechange', () => void>();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockEnumerateDevices = vi.fn();
const mockGetUserMedia = vi.fn();
const mockStop = vi.fn();

const devices = [
  {
    deviceId: 'audio-input-id',
    groupId: 'group-1',
    kind: 'audioinput',
    label: 'Microphone'
  },
  {
    deviceId: 'audio-output-id',
    groupId: 'group-1',
    kind: 'audiooutput',
    label: 'Speaker'
  },
  {
    deviceId: 'video-input-id',
    groupId: 'group-2',
    kind: 'videoinput',
    label: 'Camera'
  }
] as MediaDeviceInfo[];

const mockMediaDevices = {
  enumerateDevices: mockEnumerateDevices,
  getUserMedia: mockGetUserMedia,
  addEventListener: (type: 'devicechange', callback: () => void) => {
    mockAddEventListener(type, callback);
    trigger.add(type, callback);
  },
  removeEventListener: (type: 'devicechange', callback: () => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  }
};

beforeEach(() => {
  Object.assign(navigator, {
    mediaDevices: mockMediaDevices
  });

  trigger.clear();

  mockEnumerateDevices.mockResolvedValue(devices);
  mockGetUserMedia.mockResolvedValue({
    getTracks: () => [{ stop: mockStop }]
  });
});

it('Should use device list', async () => {
  const { result } = renderHook(useDeviceList);

  expect(result.current.devices).toEqual([]);
  expect(result.current.audioInputs).toEqual([]);
  expect(result.current.audioOutputs).toEqual([]);
  expect(result.current.videoInputs).toEqual([]);
  expect(result.current.supported).toBeTruthy();
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.update).toBeTypeOf('function');
});

it('Should use device list on server side', () => {
  const { result } = renderHookServer(useDeviceList);

  expect(result.current.devices).toEqual([]);
  expect(result.current.audioInputs).toEqual([]);
  expect(result.current.audioOutputs).toEqual([]);
  expect(result.current.videoInputs).toEqual([]);
  expect(result.current.supported).toBeFalsy();
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.update).toBeTypeOf('function');
});

it('Should use device list for unsupported', () => {
  Object.assign(navigator, {
    mediaDevices: undefined
  });

  const { result } = renderHook(useDeviceList);

  expect(result.current.devices).toEqual([]);
  expect(result.current.audioInputs).toEqual([]);
  expect(result.current.audioOutputs).toEqual([]);
  expect(result.current.videoInputs).toEqual([]);
  expect(result.current.supported).toBeFalsy();
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.update).toBeTypeOf('function');
});

it('Should load devices immediately', async () => {
  const { result } = renderHook(useDeviceList);

  await waitFor(() => {
    expect(result.current.devices).toEqual(devices);
  });

  expect(result.current.audioInputs).toEqual([devices[0]]);
  expect(result.current.audioOutputs).toEqual([devices[1]]);
  expect(result.current.videoInputs).toEqual([devices[2]]);
  expect(mockGetUserMedia).toHaveBeenCalledWith({
    audio: true,
    video: true
  });
  expect(mockEnumerateDevices).toHaveBeenCalledOnce();
  expect(mockStop).toHaveBeenCalledTimes(1);
});

it('Should support callback', async () => {
  const callback = vi.fn();

  renderHook(() => useDeviceList(callback));

  await waitFor(() => {
    expect(callback).toHaveBeenCalledWith(devices);
  });
});

it('Should update devices by action', async () => {
  const { result } = renderHook(() => useDeviceList({ immediately: false }));

  expect(mockGetUserMedia).not.toHaveBeenCalled();
  expect(mockEnumerateDevices).not.toHaveBeenCalled();
  expect(result.current.devices).toEqual([]);

  await act(result.current.update);

  expect(mockEnumerateDevices).toHaveBeenCalledOnce();
  expect(result.current.devices).toEqual(devices);
  expect(result.current.audioInputs).toEqual([devices[0]]);
  expect(result.current.audioOutputs).toEqual([devices[1]]);
  expect(result.current.videoInputs).toEqual([devices[2]]);
});

it('Should trigger device permissions and update devices by action', async () => {
  const { result } = renderHook(() => useDeviceList({ immediately: false }));

  await act(result.current.trigger);

  expect(mockGetUserMedia).toHaveBeenCalledWith({
    audio: true,
    video: true
  });
  expect(mockEnumerateDevices).toHaveBeenCalledOnce();
  expect(result.current.devices).toEqual(devices);
  expect(mockStop).toHaveBeenCalledTimes(1);
});

it('Should update devices on device change event', async () => {
  const { result } = renderHook(() => useDeviceList({ immediately: false }));
  const nextDevices = [
    {
      deviceId: 'next-audio-input-id',
      groupId: 'group-3',
      kind: 'audioinput',
      label: 'Next microphone'
    }
  ] as MediaDeviceInfo[];

  mockEnumerateDevices.mockResolvedValueOnce(nextDevices);

  act(() => trigger.callback('devicechange'));

  await waitFor(() => {
    expect(result.current.devices).toEqual(nextDevices);
  });

  expect(result.current.audioInputs).toEqual(nextDevices);
  expect(result.current.audioOutputs).toEqual([]);
  expect(result.current.videoInputs).toEqual([]);
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(() => useDeviceList({ immediately: false }));

  unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
});
