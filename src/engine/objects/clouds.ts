import { Position } from '../types';
import { createPosition } from '../utilities';

const CLOUD1_START_POSITION_X = -148;
const CLOUD1_START_POSITION_Y = 0;

const CLOUD_MAX_RIGHT = 750;

export class Clouds {
  private cloud1: Position;

  constructor() {
    this.cloud1 = createPosition(CLOUD1_START_POSITION_X, CLOUD1_START_POSITION_Y);
    // TODO: Add cloud2
  }

  public tick(delta: number): void {
    this.cloud1 = this.updateCloud1Position(delta);
    // TODO: Animate cloud2
  }

  public getCloud1Position(): Position {
    return this.cloud1;
  }

  private updateCloud1Position(delta: number): Position {
    const newCloudXPosition = this.cloud1.x + 3 * delta;

    if (newCloudXPosition >= CLOUD_MAX_RIGHT) {
      return createPosition(CLOUD1_START_POSITION_X, this.cloud1.y);
    }

    return createPosition(newCloudXPosition, this.cloud1.y);
  }
}
