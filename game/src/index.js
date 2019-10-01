import '@babel/polyfill';

import { Game } from './engine';

import './styles.less';

document.addEventListener("DOMContentLoaded", () => {
  new Game().init();
});