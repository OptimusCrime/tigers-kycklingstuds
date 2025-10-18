import {Kyckling} from "./kyckling";
import {GameState} from "../gameState";

export class Kycklings {
  private kycklings: Kyckling[];

  constructor() {
    this.kycklings = [];
  }

  public add() {
    this.kycklings.push(new Kyckling());
  }

  public get() {
    return this.kycklings;
  }

  public tick(game: GameState, delta: number): void {
    this.kycklings = this.kycklings
      .filter(kyckling => !kyckling.shouldKill())
      .map(kyckling => kyckling.tick(game, delta));
  }
}
