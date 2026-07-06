export const formatCount = (count: number, plus: boolean = false) => {
  if (count < 1000) return `${count}${plus ? '+' : ''}`;
  return `${Math.floor(count / 1000)}${count >= 1000 ? 'K' : ''}${plus ? '+' : ''}`;
};
