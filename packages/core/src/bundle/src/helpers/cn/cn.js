const normalizeClassValue = (value) => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';
  if (Array.isArray(value)) {
    const classNames = [];
    for (const item of value) {
      if (!item) continue;
      const normalizedValue = normalizeClassValue(item);
      if (normalizedValue) classNames.push(normalizedValue);
    }
    return classNames.join(' ');
  }
  const classNames = [];
  for (const className in value) {
    if (value[className]) classNames.push(className);
  }
  return classNames.join(' ');
};
export const cn = (...values) => {
  const classNames = [];
  for (const value of values) {
    if (!value) continue;
    const normalizedValue = normalizeClassValue(value);
    if (normalizedValue) classNames.push(normalizedValue);
  }
  return classNames.join(' ');
};
