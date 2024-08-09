export const getSecondsFromExpiry = (expiry: Date, shouldRound?: boolean) => {
  const now = new Date().getTime();
  const milliSecondsDistance = expiry.getTime() - now;
  if (milliSecondsDistance > 0) {
    const val = milliSecondsDistance / 1000;
    return shouldRound ? Math.round(val) : val;
  }
  return 0;
};
