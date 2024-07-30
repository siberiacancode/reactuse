export const isPermissionAllowed = (status: PermissionState) =>
  status === 'granted' || status === 'prompt';
