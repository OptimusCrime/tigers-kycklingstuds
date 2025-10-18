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
import {GameState} from "./gameState";

export const startGameLoop = (game: GameState) => window.requestAnimationFrame(() => gameLoop(game));

const resetScene = (game: GameState) => game.getCtx().clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

const writeScoreText = (game: GameState) => {
  game.getCtx().font = 'bold 26px Arial';
  game.getCtx().fillStyle = 'black';
  game.getCtx().fillText('Poäng:', 486, 30);

  game.getCtx().fillText(`${game.getScore()}`, 577, 30);
};

const writeFramePerSecond = (game: GameState) => {
  const currentTimeStamp = new Date().getTime();
  const fps = Math.round(1 / ((currentTimeStamp - game.oldTimeStamp) / 1000));

  game.oldTimeStamp = currentTimeStamp;

  if (!isNaN(fps)) {
    //Draw number to the screen
    game.getCtx().font = '10px Arial';
    game.getCtx().fillStyle = 'black';
    game.getCtx().fillText(fps.toString(), 5, 10);
  }
};

const updateMovingElements = (game: GameState) => {
  game.getPumpa().tick(game.getMousePosition());
  game.getClouds().tick();
  game.getShark().tick();
};

const updateKycklings = (game: GameState) => {
  game.getKicklings().tick(game);
};

const drawBackground = (game: GameState) => {
  game.getCtx().drawImage(
    Sprites.Cloud,
    game.getClouds().getCloud1Position().x,
    game.getClouds().getCloud1Position().y
  );

  // TODO implement cloud2

  game.getCtx().drawImage(
    Sprites.Score,
    ScorePosition.x,
    ScorePosition.y
  );

  writeScoreText(game);

  game.getCtx().drawImage(
    Sprites.Background,
    BackgroundPosition.x,
    BackgroundPosition.y
  );

  game.getCtx().drawImage(
    game.getShark().getSprite(),
    game.getShark().getPosition().x,
    game.getShark().getPosition().y
  );

  game.getCtx().drawImage(
    Sprites.Water,
    WaterPosition.x,
    WaterPosition.y
  );

  game.getCtx().drawImage(
    Sprites.Ground,
    GroundHighPosition.x,
    GroundHighPosition.y
  );

  game.getCtx().drawImage(
    Sprites.Ground,
    GroundLowPosition.x,
    GroundLowPosition.y
  );

  game.getCtx().drawImage(
    game.getPumpa().getSprite(),
    game.getPumpa().getPosition().x,
    game.getPumpa().getPosition().y
  );

  writeFramePerSecond(game);
};

const drawKycklings = (game: GameState) => {
  game.getKicklings().get().map(kyckling => {
    // What would StackOverflow do?
    // https://stackoverflow.com/a/46921702/921563
    game.getCtx().save();

    game.getCtx().translate(
      kyckling.getPosition().x + KycklingHalfSize.width,
      kyckling.getPosition().y + KycklingHalfSize.height
    );

    game.getCtx().rotate(degreesToRad(kyckling.getRotation()));
    game.getCtx().translate(
      -KycklingHalfSize.width,
      -KycklingHalfSize.height
    );

    game.getCtx().drawImage(
      kyckling.getSprite(),
      0,
      0
    );

    game.getCtx().rotate(-degreesToRad(kyckling.getRotation()));

    game.getCtx().restore();
  });
};

const gameLoop = (game: GameState) => {
  // TODO: Unbind gamestate from framerate
  game.incrementTick()

  resetScene(game);
  updateMovingElements(game);
  updateKycklings(game);
  drawBackground(game);
  drawKycklings(game);

  game.getSpawnControl().tick(game);

  window.requestAnimationFrame(() => gameLoop(game));
};
