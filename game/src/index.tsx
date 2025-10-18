import { GameState } from './engine/gameState';

import './styles.css';

document.addEventListener("DOMContentLoaded", async () => {
  const gameState = new GameState();
  await gameState.start();
});
