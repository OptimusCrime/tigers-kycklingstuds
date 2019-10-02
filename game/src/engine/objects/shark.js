import {Position} from "../utilities";
import {Sprites} from "../sprites";

const SHARK_LEFT_MIN = 100;
const SHARK_RIGHT_MAX = 520;

const SHARK_POSITION_Y = 285;

const SHARK_DIRECTION_LEFT = 'left';
const SHARK_DIRECTION_RIGHT = 'right';

export class Shark {

  constructor() {
    this.position = Position(SHARK_LEFT_MIN, SHARK_POSITION_Y);
    this.sprite = Sprites.SharkRight;
    this.direction = SHARK_DIRECTION_RIGHT;
  }

  tick() {
    const newSharkPosition = this.position.x + ((this.direction === SHARK_DIRECTION_RIGHT) ? 4 : -4);

    if (this.direction === SHARK_DIRECTION_RIGHT && newSharkPosition >= SHARK_RIGHT_MAX) {
      this.direction = SHARK_DIRECTION_LEFT;
      this.sprite = Sprites.SharkLeft;
      this.position = Position(SHARK_RIGHT_MAX, SHARK_POSITION_Y);
    }
    else if (this.direction === SHARK_DIRECTION_LEFT && newSharkPosition <= SHARK_LEFT_MIN) {
      this.direction = SHARK_DIRECTION_RIGHT;
      this.sprite = Sprites.SharkRight;
      this.position = Position(SHARK_LEFT_MIN, SHARK_POSITION_Y);
    }

    this.position = Position(newSharkPosition, SHARK_POSITION_Y);
  }
}