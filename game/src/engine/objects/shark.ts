import {createPosition} from "../utilities";
import {Sprites} from "../sprites";
import {Direction, Position} from "../types";

const SHARK_LEFT_MIN = 100;
const SHARK_RIGHT_MAX = 520;

const SHARK_POSITION_Y = 285;

export class Shark {

  private position: Position;
  private sprite: HTMLImageElement;
  private direction: Direction;

  constructor() {
    this.position = createPosition(SHARK_LEFT_MIN, SHARK_POSITION_Y);
    this.sprite = Sprites.SharkRight;
    this.direction = Direction.RIGHT;
  }

  public tick(delta: number): void {
    const newSharkPosition = this.position.x + (((this.direction === Direction.RIGHT) ? 4 : -4) * delta);

    if (this.direction === Direction.RIGHT && newSharkPosition >= SHARK_RIGHT_MAX) {
      this.direction = Direction.LEFT;
      this.sprite = Sprites.SharkLeft;
      this.position = createPosition(SHARK_RIGHT_MAX, SHARK_POSITION_Y);
    }
    else if (this.direction === Direction.LEFT && newSharkPosition <= SHARK_LEFT_MIN) {
      this.direction = Direction.RIGHT;
      this.sprite = Sprites.SharkRight;
      this.position = createPosition(SHARK_LEFT_MIN, SHARK_POSITION_Y);
    }

    this.position = createPosition(newSharkPosition, SHARK_POSITION_Y);
  }

  public getSprite(): HTMLImageElement {
    return this.sprite;
  }

  public getPosition() : Position{
    return this.position;
  }
}
