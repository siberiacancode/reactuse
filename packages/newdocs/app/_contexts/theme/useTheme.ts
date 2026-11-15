import { use } from 'react';

import { ThemeContext } from './ThemeContext';

export const useTheme = () => use(ThemeContext);
