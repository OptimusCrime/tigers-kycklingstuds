import { KycklingHalfSize, PumpaSize, Sprites } from '../sprites';
import { AnimationFrameDirection, Position } from '../types';
import { createPosition } from '../utilities';
import { Kyckling } from './kyckling';

const PUMPA_WIDTH = 148;
const PUMPA_RELATIVE_X_OFFSET = 5;

const PUMPA_START_POSITION_X = 200;
const PUMPA_START_POSITION_Y = 306;

const PUMPA_LEFT_MIN = 60;
const PUMPA_RIGHT_MAX = 420;

// This is used to center the mouse over pumpa, using some magical x offset
const PUMPA_POSITION_X_OFFSET = PUMPA_WIDTH / 2 - PUMPA_RELATIVE_X_OFFSET;

const PUMPA_ANIMATION_FRAMES = [Sprites.Pumpa1, Sprites.Pumpa2, Sprites.Pumpa3];

const PUMPA_ANIMATION_RELATIVE_TICK_LIMIT = 10;

const PUMPA_ANIMATION_START_FRAME = 0;
const PUMPA_ANIMATION_END_FRAME = PUMPA_ANIMATION_FRAMES.length - 1;

export class Pumpa {
  private accumulator: number;
  private position: Position;
  private animationFrame: number;
  private animationFramesDirection: AnimationFrameDirection;

  constructor() {
    this.accumulator = 0;
    this.position = createPosition(PUMPA_START_POSITION_X, PUMPA_START_POSITION_Y);
    this.animationFrame = PUMPA_ANIMATION_START_FRAME;
    this.animationFramesDirection = AnimationFrameDirection.INCREASE;
  }

  public getSprite(): HTMLImageElement {
    return PUMPA_ANIMATION_FRAMES[this.animationFrame];
  }

  public tick(delta: number, mousePosition: Position): void {
    this.accumulator += delta;

    this.position = createPosition(Pumpa.pumpaXPosition(mousePosition.x), this.position.y);

    if (this.accumulator >= PUMPA_ANIMATION_RELATIVE_TICK_LIMIT) {
      this.updateAnimationFrame();
    }
  }

  public getPosition(): Position {
    return this.position;
  }

  public checkBounce(kyckling: Kyckling): boolean {
    // We're kind and allowing the kyckling to survive even if just half of it hit the pumpa
    const kycklingCenter = kyckling.getPosition().x + KycklingHalfSize.width;
    return kycklingCenter >= this.position.x && kycklingCenter <= this.position.x + PumpaSize.width;
  }

  private updateAnimationFrame(): void {
    this.accumulator -= PUMPA_ANIMATION_RELATIVE_TICK_LIMIT;

    if (this.animationFramesDirection === AnimationFrameDirection.INCREASE) {
      const newFrame = this.animationFrame + 1;
      if (newFrame > PUMPA_ANIMATION_END_FRAME) {
        this.animationFrame = PUMPA_ANIMATION_END_FRAME;
        this.animationFramesDirection = AnimationFrameDirection.DECREASE;
        return;
      }

      this.animationFrame = newFrame;

      return;
    }

    const newFrame = this.animationFrame - 1;
    if (newFrame <= PUMPA_ANIMATION_START_FRAME) {
      this.animationFrame = PUMPA_ANIMATION_START_FRAME;
      this.animationFramesDirection = AnimationFrameDirection.INCREASE;
    }

    this.animationFrame = newFrame;
  }

  private static pumpaXPosition(mousePositionX: number): number {
    return Math.min(PUMPA_RIGHT_MAX, Math.max(PUMPA_LEFT_MIN, mousePositionX - PUMPA_POSITION_X_OFFSET));
  }
}
