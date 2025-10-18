import {createPosition} from "../utilities";
import {Sprites} from "../sprites";
import {Position} from "../types";
import {GameState} from "../gameState";

const KYCKLING_START_POSITION_X = -65;
const KYCKLING_START_POSITION_Y = 58;

const KYCKLING_DY_INITIAL_VALUE = -5;
const KYCKLING_DY_FALL_VALUE = -22;

const KYCKLING_MODE_WALK = 'walk';
const KYCKLING_MODE_FALL = 'wall';

const KYCKLING_WALK_TO_FALL_LIMIT = 75;
const KYCKLING_SAFE_LIMIT = 620;
const KYCKLING_FALL_CAPTURE_START = 270;
const KYCKLING_FALL_CAPTURE_END = 290;
const KYCKLING_FALL_TO_WALK_SAFE_X_LIMIT = 520;
const KYCKLING_FALL_TO_WALK_SAFE_Y_LIMIT = 160;

const KYCKLING_ANIMATION_WALKING_RELATIVE_TICK_LIMIT = 5;

const KYCKLING_ANIMATION_WALKING_FRAMES = [
  Sprites.KycklingWalk1,
  Sprites.KycklingWalk2,
];

const KYCKLING_ANIMATION_WALKING_FRAME = 0;
const KYCKLING_ANIMATION_WALKING_END_FRAME = KYCKLING_ANIMATION_WALKING_FRAMES.length - 1;

export class Kyckling {
  private relativeTick : number;
  private relativeTickWalking : number;

  private position : Position;

  private animationFrame : number;

  private mode : string; // TODO: enum
  private dy : number;
  private rotation : number;

  private kill : boolean;

  constructor() {
    this.relativeTick = 0;
    this.relativeTickWalking = 0;

    this.position = createPosition(KYCKLING_START_POSITION_X, KYCKLING_START_POSITION_Y);

    this.animationFrame = KYCKLING_ANIMATION_WALKING_FRAME;

    this.mode = KYCKLING_MODE_WALK;
    this.dy = KYCKLING_DY_INITIAL_VALUE;
    this.rotation = 0;

    this.kill = false;
  }

  public getSprite() {
    if (this.mode === KYCKLING_MODE_FALL) {
      return Sprites.KycklingAir;
    }

    if (this.relativeTickWalking >= KYCKLING_ANIMATION_WALKING_RELATIVE_TICK_LIMIT) {
      this.relativeTickWalking = 0;
      const newFrame = this.animationFrame + 1;
      if (newFrame > KYCKLING_ANIMATION_WALKING_END_FRAME) {
        this.animationFrame = KYCKLING_ANIMATION_WALKING_FRAME;
      }
      else {
        this.animationFrame = newFrame;
      }
    }

    return KYCKLING_ANIMATION_WALKING_FRAMES[this.animationFrame];
  }

  public tick(game: GameState) {
    if (this.mode === KYCKLING_MODE_FALL) {
      // Keep rotating, even if the game is paused, as a generous honor to the original game
      this.rotation += 4;
      if (this.rotation >= 360) {
        this.rotation = 0;
      }
    }
    else if (this.mode === KYCKLING_MODE_WALK) {
      this.relativeTickWalking++;
    }

    if (game.isPaused()) {
      return this;
    }

    this.relativeTick++;

    if (this.relativeTick % 2 === 0) {
      return this;
    }

    if (this.mode === KYCKLING_MODE_WALK) {
      this.position = createPosition(
        this.position.x + 2,
        this.position.y
      );

      if (this.position.x >= KYCKLING_WALK_TO_FALL_LIMIT && this.position.x <= KYCKLING_FALL_TO_WALK_SAFE_X_LIMIT) {
        this.mode = KYCKLING_MODE_FALL;
        return this;
      }

      if (this.position.x >= KYCKLING_SAFE_LIMIT) {
        game.incrementScore();
        this.kill = true;
        return this;
      }

      return this;
    }

    if (this.mode === KYCKLING_MODE_FALL) {
      const tempPositionX = this.position.x + 3;
      const tempPositionY = this.position.y + this.dy;
      this.dy++;

      // We're trying to save the kyckling for some additional frames
      if (tempPositionY >= KYCKLING_FALL_CAPTURE_START && this.dy >= 0) {
        this.position = createPosition(tempPositionX, tempPositionY);
        if (game.getPumpa().checkBounce(this)) {
          this.dy = KYCKLING_DY_FALL_VALUE;
          return this;
        }
      }

      // Last chance at capturing
      if (tempPositionY >= KYCKLING_FALL_CAPTURE_END && this.dy >= 0) {
        this.position = createPosition(tempPositionX, KYCKLING_FALL_CAPTURE_END);
        this.dy = KYCKLING_DY_FALL_VALUE;

        if (!game.getPumpa().checkBounce(this)) {
          // TODO handle death better
          this.kill = true;
        }

        return this;
      }

      if (tempPositionX > KYCKLING_FALL_TO_WALK_SAFE_X_LIMIT && tempPositionY >= KYCKLING_FALL_TO_WALK_SAFE_Y_LIMIT && this.dy >= 0) {
        this.position = createPosition(tempPositionX, KYCKLING_FALL_TO_WALK_SAFE_Y_LIMIT);
        this.mode = KYCKLING_MODE_WALK;
        this.rotation = 0;
        return this;
      }

      this.position = createPosition(tempPositionX, tempPositionY);
      return this;
    }

    return this;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getRotation(): number {
    return this.rotation;
  }

  public shouldKill() {
    return this.kill;
  }
}
