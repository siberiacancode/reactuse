export const getRetry = (retry) => {
    if (typeof retry === 'number')
        return retry;
    return retry ? 1 : 0;
};
