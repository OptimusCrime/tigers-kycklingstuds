import {Position} from "../utilities";
import {Sprites} from "../sprites";

const PUMPA_START_POSITION_X = 200;
const PUMPA_START_POSITION_Y = 357;

export class Pumpa {
  constructor() {
    console.log(Sprites);
    this.relativeTick = 0;
    this.position = Position(PUMPA_START_POSITION_X, PUMPA_START_POSITION_Y);
    this.sprite = Sprites.Pumpa1;
  }

  tick(mousePosition) {
    this.relativeTick++;

    this.position = Position(mousePosition.x, this.position.y);
  }

}