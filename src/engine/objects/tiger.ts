import { Sprites } from '../sprites';
import { AnimationFrameDirection } from '../types';

const TIGER_ANIMATION_FRAMES = [
  Sprites.Tiger1,
  Sprites.Tiger2,
  Sprites.Tiger3,
  Sprites.Tiger4,
  Sprites.Tiger5,
  Sprites.Tiger6,
  Sprites.Tiger7,
  Sprites.Tiger8,
  Sprites.Tiger9,
  Sprites.Tiger10,
  Sprites.Tiger11,
  Sprites.Tiger12,
  Sprites.Tiger13,
  Sprites.Tiger14,
  Sprites.Tiger15,
  Sprites.Tiger16,
  Sprites.Tiger17,
];

const TIGER_ANIMATION_RELATIVE_TICK_LIMIT = 1;

const TIGER_ANIMATION_START_FRAME = 0;
const TIGER_ANIMATION_END_FRAME = TIGER_ANIMATION_FRAMES.length - 1;

export class Tiger {
  private accumulator: number;
  private animationFrame: number;
  private animationFramesDirection: AnimationFrameDirection;

  constructor() {
    this.accumulator = 0;
    this.animationFrame = TIGER_ANIMATION_START_FRAME;
    this.animationFramesDirection = AnimationFrameDirection.INCREASE;
  }

  public getSprite(): HTMLImageElement {
    return TIGER_ANIMATION_FRAMES[this.animationFrame];
  }

  public tick(delta: number): void {
    this.accumulator += delta;

    if (this.accumulator >= TIGER_ANIMATION_RELATIVE_TICK_LIMIT) {
      this.updateAnimationFrame();
    }
  }

  private updateAnimationFrame(): void {
    this.accumulator -= TIGER_ANIMATION_RELATIVE_TICK_LIMIT;

    if (this.animationFramesDirection === AnimationFrameDirection.INCREASE) {
      const newFrame = this.animationFrame + 1;
      if (newFrame > TIGER_ANIMATION_END_FRAME) {
        this.animationFrame = TIGER_ANIMATION_END_FRAME;
        this.animationFramesDirection = AnimationFrameDirection.DECREASE;
        return;
      }

      this.animationFrame = newFrame;

      return;
    }

    const newFrame = this.animationFrame - 1;
    if (newFrame <= TIGER_ANIMATION_START_FRAME) {
      this.animationFrame = TIGER_ANIMATION_START_FRAME;
      this.animationFramesDirection = AnimationFrameDirection.INCREASE;
    }

    this.animationFrame = newFrame;
  }
}
