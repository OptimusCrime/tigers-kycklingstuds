import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants";
import {
  Sprites,
  ScorePosition,
  BackgroundPosition,
  WaterPosition,
  GroundHighPosition,
  GroundLowPosition,
  KycklingHalfSize,
  PumpaHalfSize
} from "./sprites";
import {degreesToRad} from "./utilities";

export const startGameLoop = game => window.requestAnimationFrame(() => gameLoop(game));

const resetScene = game => game.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

const writeScoreText = game => {
  game.ctx.font = 'bold 26px Arial';
  game.ctx.fillStyle = 'black';
  game.ctx.fillText('Poäng:', 486, 30);

  game.ctx.fillText(game.score, 577, 30);
};

const writeFramePerSecond = game => {
  const currentTimeStamp = new Date().getTime();
  const fps = Math.round(1 / ((currentTimeStamp - game.oldTimeStamp) / 1000));

  game.oldTimeStamp = currentTimeStamp;

  if (!isNaN(fps)) {
    //Draw number to the screen
    game.ctx.font = '10px Arial';
    game.ctx.fillStyle = 'black';
    game.ctx.fillText(fps.toString(), 5, 10);
  }
};

const updateMovingElements = game => {
  game.pumpa.tick(game.mousePosition);
  game.clouds.tick();
  game.shark.tick();
};

const updateKycklings = game => {
  game.kycklings.tick(game);
};

const drawBackground = game => {
  game.ctx.drawImage(
    Sprites.Cloud,
    game.clouds.cloud1.x,
    game.clouds.cloud1.y
  );

  // TODO implement cloud2

  game.ctx.drawImage(
    Sprites.Score,
    ScorePosition.x,
    ScorePosition.y
  );

  writeScoreText(game);

  game.ctx.drawImage(
    Sprites.Background,
    BackgroundPosition.x,
    BackgroundPosition.y
  );

  game.ctx.drawImage(
    game.shark.sprite,
    game.shark.position.x,
    game.shark.position.y
  );

  game.ctx.drawImage(
    Sprites.Water,
    WaterPosition.x,
    WaterPosition.y
  );

  game.ctx.drawImage(
    Sprites.Ground,
    GroundHighPosition.x,
    GroundHighPosition.y
  );

  game.ctx.drawImage(
    Sprites.Ground,
    GroundLowPosition.x,
    GroundLowPosition.y
  );

  // TODO remove
  /*
  game.ctx.beginPath();
  game.ctx.rect(game.pumpa.position.x, game.pumpa.position.y, PumpaHalfSize.width * 2, PumpaHalfSize.height * 2);
  game.ctx.stroke();
   */

  game.ctx.drawImage(
    game.pumpa.getSprite(),
    game.pumpa.position.x,
    game.pumpa.position.y
  );

  writeFramePerSecond(game);
};

const drawKycklings = game => {
  game.kycklings.get().map(kyckling => {
    // TODO remove
    /*
    game.ctx.beginPath();
    game.ctx.rect(kyckling.position.x, kyckling.position.y, KycklingHalfSize.width * 2, KycklingHalfSize.height * 2);
    game.ctx.stroke();

    game.ctx.drawImage(
      kyckling.getSprite(),
      kyckling.position.x,
      kyckling.position.y
    );
    */

    // What would StackOverflow do?
    // https://stackoverflow.com/a/46921702/921563
    game.ctx.save();

    game.ctx.translate(
      kyckling.position.x + KycklingHalfSize.width,
      kyckling.position.y + KycklingHalfSize.height
    );

    game.ctx.rotate(degreesToRad(kyckling.rotation));
    game.ctx.translate(
      -KycklingHalfSize.width,
      -KycklingHalfSize.height
    );

    game.ctx.drawImage(
      kyckling.getSprite(),
      0,
      0
    );

    game.ctx.rotate(-degreesToRad(kyckling.rotation));

    game.ctx.restore();
  });
};

const gameLoop = game => {
  game.tick++;

  resetScene(game);
  updateMovingElements(game);
  updateKycklings(game);
  drawBackground(game);
  drawKycklings(game);

  if (game.tick % 2 === 0 && !game.paused) {
    game.spawnControl.tick(game);

  }

  window.requestAnimationFrame(() => gameLoop(game));
};