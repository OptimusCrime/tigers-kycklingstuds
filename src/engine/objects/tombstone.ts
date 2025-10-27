import { Sprites } from '../sprites';
import { Position } from '../types';
import { createPosition, randomizeNumberBetween } from '../utilities';

const TOMBSTONE_POSITION_Y = 365;
const TOMBSTONE_POSITION_X_MIN = 60;
const TOMBSTONE_POSITION_X_MAX = 430;

const TOMBSTONE_ANIMATION_FRAMES = [
  Sprites.Tombstone1,
  Sprites.Tombstone2,
  Sprites.Tombstone3,
  Sprites.Tombstone4,
  Sprites.Tombstone5,
  Sprites.Tombstone6,
  Sprites.Tombstone7,
];

const TOMBSTONE_ANIMATION_RELATIVE_TICK_LIMIT = 1.5;

const TOMBSTONE_ANIMATION_START_FRAME = 0;
const TOMBSTONE_ANIMATION_END_FRAME = TOMBSTONE_ANIMATION_FRAMES.length - 1;

export class Tombstone {
  private accumulator: number;
  private readonly position: Position;
  private animationFrame: number;

  constructor() {
    this.accumulator = 0;
    this.position = createPosition(
      randomizeNumberBetween(TOMBSTONE_POSITION_X_MIN, TOMBSTONE_POSITION_X_MAX),
      TOMBSTONE_POSITION_Y,
    );
    this.animationFrame = TOMBSTONE_ANIMATION_START_FRAME;
  }

  public getSprite(): HTMLImageElement {
    return TOMBSTONE_ANIMATION_FRAMES[this.animationFrame];
  }

  public tick(delta: number): Tombstone {
    this.accumulator += delta;

    if (this.accumulator >= TOMBSTONE_ANIMATION_RELATIVE_TICK_LIMIT) {
      this.updateAnimationFrame();
    }

    return this;
  }

  public getPosition(): Position {
    return this.position;
  }

  private updateAnimationFrame(): void {
    this.accumulator -= TOMBSTONE_ANIMATION_RELATIVE_TICK_LIMIT;

    const newFrame = this.animationFrame + 1;
    if (newFrame > TOMBSTONE_ANIMATION_END_FRAME) {
      this.animationFrame = TOMBSTONE_ANIMATION_START_FRAME;
      return;
    }

    this.animationFrame = newFrame;
  }
}
