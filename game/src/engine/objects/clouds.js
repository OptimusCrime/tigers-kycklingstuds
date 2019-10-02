import {Position} from "../utilities";
import {Sprites} from "../sprites";

const CLOUD1_START_POSITION_X = -148;
const CLOUD1_START_POSITION_Y = 0;

const CLOUD_MAX_RIGHT = 750;

export class Clouds {

  constructor() {
    this.cloud1 = Position(CLOUD1_START_POSITION_X, CLOUD1_START_POSITION_Y);
    // TODO implement cloud2
  }

  tick() {
    this.cloud1 = Clouds._updateCloudPosition(this.cloud1, CLOUD1_START_POSITION_X);
  }

  static _updateCloudPosition(currentPosition, restartPosition) {
    const newCloudXPosition = currentPosition.x + 2;

    if (newCloudXPosition >= CLOUD_MAX_RIGHT) {
      return Position(
        restartPosition,
        currentPosition.y
      )
    }

    return Position(
      currentPosition.x + 2,
      currentPosition.y
    );
  }
}