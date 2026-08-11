export const formatCount = (count: number, plus: boolean = false) => {
  if (count < 1000) return `${count}${plus ? '+' : ''}`;
  return `${Math.floor(count / 1000)}${count >= 1000 ? 'K' : ''}${plus ? '+' : ''}`;
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

export const getOgImageUrl = (pageUrl: string) => `/og${pageUrl}.png`;

export const getPromptUrl = (baseURL: string, url: string) =>
  `${baseURL}?q=${encodeURIComponent(`I'm looking at this reactuse documentation: ${url}.\n\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`)}`;
