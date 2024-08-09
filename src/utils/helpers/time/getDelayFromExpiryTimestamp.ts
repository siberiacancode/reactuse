import { getSecondsFromExpiry } from './getSecondsFromExpiry';

const DEFAULT_DELAY = 10000;

export const getDelayFromExpiryTimestamp = (expiryTimestamp: Date) => {
  const seconds = getSecondsFromExpiry(expiryTimestamp);
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000);

  return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY;
};
