import { GameState } from '../gameState';
import { Kyckling } from './kyckling';

export class Kycklings {
  private kycklings: Kyckling[];

  constructor() {
    this.kycklings = [];
  }

  public add(): void {
    this.kycklings.push(new Kyckling());
  }

  public get(): Kyckling[] {
    return this.kycklings;
  }

  public tick(game: GameState, delta: number): void {
    this.kycklings = this.kycklings
      .filter((kyckling) => !kyckling.shouldKill())
      .map((kyckling) => kyckling.tick(game, delta));
  }
}
