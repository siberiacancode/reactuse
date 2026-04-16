import type { EnhanceAppContext } from 'vitepress';

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import Theme from 'vitepress/theme';
import { h } from 'vue';

import { HomeHeroBefore } from '../sections';

import '@shikijs/vitepress-twoslash/style.css';
import './global.css';

export default {
  extends: Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-hero-before': () => h(HomeHeroBefore)
    });
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue);
  }
};
