export type ClassDictionary = Record<string, unknown>;
export type ClassArray = ClassValue[];
export type ClassValue =
  | boolean
  | number
  | string
  | ClassArray
  | ClassDictionary
  | null
  | undefined;

const normalizeClassValue = (value: ClassValue): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';

  if (Array.isArray(value)) {
    const classNames: string[] = [];

    for (const item of value) {
      if (!item) continue;
      const normalizedValue = normalizeClassValue(item);
      if (normalizedValue) classNames.push(normalizedValue);
    }

    return classNames.join(' ');
  }

  const classNames: string[] = [];
  for (const className in value) {
    if (value[className]) classNames.push(className);
  }

  return classNames.join(' ');
};

export const cn = (...values: ClassValue[]) => {
  const classNames: string[] = [];

  for (const value of values) {
    if (!value) continue;
    const normalizedValue = normalizeClassValue(value);
    if (normalizedValue) classNames.push(normalizedValue);
  }

  return classNames.join(' ');
};
