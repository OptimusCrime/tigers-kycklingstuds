import './styles.css';

import { GameState } from './engine/gameState';

document.addEventListener('DOMContentLoaded', async () => {
  const gameState = new GameState();
  await gameState.start();
});
