import { GameState } from './engine/gameState';

import './styles.css';

document.addEventListener("DOMContentLoaded", () => {
  new GameState().run();
});
