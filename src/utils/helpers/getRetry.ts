export const getRetry = (retry: number | boolean) => {
  if (typeof retry === 'number') return retry;
  return retry ? 1 : 0;
};
