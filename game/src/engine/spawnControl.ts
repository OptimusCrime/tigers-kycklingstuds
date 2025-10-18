import {randomizeDistance} from "./utilities";
import {GameState} from "./gameState";

const FIRST_LEVEL_CHANGE = 5;
const PAUSE_AFTER_FIRST_WAVE = 4;
const RELEASE_TIME_ADDED_DELAY = 45;

export class SpawnControl {
  private timeslots: number;
  private releaseTime: number[];
  private releaseCount: number;
  private nextLevelChange: number;

  constructor() {
    this.timeslots = 0;
    this.releaseTime = [];
    this.releaseCount = 0;
    this.nextLevelChange = FIRST_LEVEL_CHANGE;

    this.initReleaseTimeTable(1);
  }

  public tick(game: GameState, delta: number): void {
    if (this.releaseCount >= this.nextLevelChange) {
      this.initReleaseTimeTable(this.timeslots + 1, PAUSE_AFTER_FIRST_WAVE);
    }

    this.decreaseQueueWaitingTime(game, delta);
  }

  private initReleaseTimeTable(numSlots: number, pause: number = 0): void {
    this.timeslots = numSlots;
    this.releaseTime = [];

    for (let i = 0; i < numSlots; i++) {
      this.releaseTime.push(
        (45 * i / numSlots + 45 * (i * 9973 % numSlots) + 45 * pause) // I have no idea
      );
    }

    this.nextLevelChange = 5 * numSlots * (1 + numSlots) / 2;
  }

  private decreaseQueueWaitingTime(game: GameState, delta: number): void {
    for (let i = 0; i < this.releaseTime.length; i++) {
      if (this.releaseTime[i] <= 0) {
        this.releaseTime[i] += (RELEASE_TIME_ADDED_DELAY * randomizeDistance());
        this.releaseCount++;

        game.getKicklings().add();
      }

      this.releaseTime[i] -= delta;
    }
  }
}
