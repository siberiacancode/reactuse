import React from 'react';

export const useMount = (effect: React.EffectCallback) => React.useEffect(effect, []);
