import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants";

export const startGameLoop = game => window.requestAnimationFrame(() => gameLoop(game));

const resetScene = game => game.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

const drawBackground = game => {
  game.ctx.drawImage(
    game.pumpa.sprite,
    game.pumpa.position.x,
    game.pumpa.position.y
  )
};

const updatePumpa = game => {
  game.pumpa.tick(game.mousePosition)
}

const gameLoop = game => {
  resetScene(game);
  updatePumpa(game);
  drawBackground(game);

  window.requestAnimationFrame(() => gameLoop(game));
};