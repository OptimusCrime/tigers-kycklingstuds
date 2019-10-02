import {Position} from "../utilities";
import {Kyckling} from "./kyckling";

export class Kycklings {

  constructor() {
    this.kycklings = [];
  }

  add() {
    this.kycklings.push(new Kyckling());
  }

  get() {
    return this.kycklings;
  }

  tick(game) {
    this.kycklings = this.kycklings
      .filter(kyckling => !kyckling.kill)
      .map(kyckling => kyckling.tick(game));
  }
}