import {randomizeDistance} from "./utilities";

const FIRST_LEVEL_CHANGE = 5;
const PAUSE_AFTER_FIRST_WAVE = 4;
const RELEASE_TIME_ADDED_DELAY = 45;

export class SpawnControl {

  constructor() {
    this.timeslots = 0;
    this.releaseTime = [];
    this.releaseCount = 0;
    this.nextLevelChange = FIRST_LEVEL_CHANGE;

    this._initReleaseTimeTable(1);
  }

  tick(game) {
    if (this.releaseCount >= this.nextLevelChange) {
      this._initReleaseTimeTable(this.timeslots + 1, PAUSE_AFTER_FIRST_WAVE);
    }

    this._decreaseQueueWaitingTime(game);
  }

  _initReleaseTimeTable(numSlots, pause = 0) {
    this.timeslots = numSlots;
    this.releaseTime = [];

    for (let i = 0; i < numSlots; i++) {
      this.releaseTime.push(
        (45 * i / numSlots + 45 * (i * 9973 % numSlots) + 45 * pause) // I have no idea
      );
    }

    this.nextLevelChange = 5 * numSlots * (1 + numSlots) / 2;
  }

  _decreaseQueueWaitingTime(game) {
    for (let i = 0; i < this.releaseTime.length; i++) {
      if (this.releaseTime[i] <= 0) {
        this.releaseTime[i] += (RELEASE_TIME_ADDED_DELAY * randomizeDistance());
        this.releaseCount++;

        game.kycklings.add();
      }

      this.releaseTime[i]--;
    }
  }
}