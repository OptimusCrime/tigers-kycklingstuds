import {Position} from "../utilities";
import {KycklingHalfSize, PumpaSize, Sprites} from "../sprites";

const PUMPA_WIDTH = 148;
const PUMPA_RELATIVE_X_OFFSET = 5;

const PUMPA_START_POSITION_X = 200;
const PUMPA_START_POSITION_Y = 306;

const PUMPA_LEFT_MIN = 60;
const PUMPA_RIGHT_MAX = 420;

// This is used to center the mouse over pumpa, using some magical x offset
const PUMPA_POSITION_X_OFFSET = (PUMPA_WIDTH / 2) - PUMPA_RELATIVE_X_OFFSET;

const PUMPA_ANIMATION_FRAMES = [
  Sprites.Pumpa1,
  Sprites.Pumpa2,
  Sprites.Pumpa3,
];

const PUMPA_ANIMATION_RELATIVE_TICK_LIMIT = 7;

const PUMPA_ANIMATION_START_FRAME = 0;
const PUMPA_ANIMATION_END_FRAME = PUMPA_ANIMATION_FRAMES.length - 1;

const PUMPA_ANIMATION_FRAMES_DIRECTION_INCREASE = 'increase';
const PUMPA_ANIMATION_FRAMES_DIRECTION_DECREASE = 'decrease';

export class Pumpa {
  constructor() {
    this.relativeTick = 0;
    this.position = Position(PUMPA_START_POSITION_X, PUMPA_START_POSITION_Y);
    this.animationFrame = PUMPA_ANIMATION_START_FRAME;
    this.animationFramesDirection = PUMPA_ANIMATION_FRAMES_DIRECTION_INCREASE;
  }

  getSprite() {
    return PUMPA_ANIMATION_FRAMES[this.animationFrame];
  }

  tick(mousePosition) {
    this.relativeTick++;

    this.position = Position(
      Pumpa._pumpaXPosition(mousePosition.x),
      this.position.y
    );

    if (this.relativeTick >= PUMPA_ANIMATION_RELATIVE_TICK_LIMIT) {
      this._updateAnimationFrame();
      this.relativeTick = 0;
    }
  }

  checkBounce(kyckling) {
    // We're kind and allowing the kyckling to survive even if just half of it hit the pumpa
    const kycklingCenter = kyckling.position.x + KycklingHalfSize.width;
    return kycklingCenter >= this.position.x && kycklingCenter <= (this.position.x + PumpaSize.width);
  }

  _updateAnimationFrame() {
    if (this.animationFramesDirection === PUMPA_ANIMATION_FRAMES_DIRECTION_INCREASE) {
      const newFrame = this.animationFrame + 1;
      if (newFrame > PUMPA_ANIMATION_END_FRAME) {
        this.animationFrame = PUMPA_ANIMATION_END_FRAME;
        this.animationFramesDirection = PUMPA_ANIMATION_FRAMES_DIRECTION_DECREASE;
        return;
      }

      this.animationFrame = newFrame;

      return;
    }

    const newFrame = this.animationFrame - 1;
    if (newFrame <= PUMPA_ANIMATION_START_FRAME) {
      this.animationFrame = PUMPA_ANIMATION_START_FRAME;
      this.animationFramesDirection = PUMPA_ANIMATION_FRAMES_DIRECTION_INCREASE;
    }

    this.animationFrame = newFrame;
  }

  static _pumpaXPosition(mousePositionX) {
    return Math.min(
      PUMPA_RIGHT_MAX,
      Math.max(
        PUMPA_LEFT_MIN,
        mousePositionX - PUMPA_POSITION_X_OFFSET
      )
    );
  }
}