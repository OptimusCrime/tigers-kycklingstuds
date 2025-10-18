import {createPosition} from "../utilities";
import {Position} from "../types";

const CLOUD1_START_POSITION_X = -148;
const CLOUD1_START_POSITION_Y = 0;

const CLOUD_MAX_RIGHT = 750;

export class Clouds {
  private cloud1: Position;

  constructor() {
    this.cloud1 = createPosition(CLOUD1_START_POSITION_X, CLOUD1_START_POSITION_Y);
    // TODO implement cloud2
  }

  public tick() {
    this.cloud1 = this.updateCloud1Position();
  }

  public getCloud1Position() {
    return this.cloud1;
  }

  private updateCloud1Position() {
    const newCloudXPosition = this.cloud1.x + 2;

    if (newCloudXPosition >= CLOUD_MAX_RIGHT) {
      return createPosition(
        CLOUD1_START_POSITION_X,
        this.cloud1.y
      )
    }

    return createPosition(
      this.cloud1.x + 2,
      this.cloud1.y
    );
  }
}
