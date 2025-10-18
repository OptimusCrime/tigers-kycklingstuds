import {Preloader} from "./sprites";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants";
import {startGameLoop} from "./loop";
import {createPosition} from "./utilities";
import {SpawnControl} from "./spawnControl";

import {Pumpa} from "./objects/pumpa";
import {Clouds} from "./objects/clouds";
import {Shark} from "./objects/shark";
import {Kycklings} from "./objects/kycklings";
import {Position} from "./types";

export class GameState {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private readonly pumpa :Pumpa;
  private readonly clouds :Clouds;
  private readonly shark :Shark;
  private readonly kycklings :Kycklings;

  private readonly spawnControl: SpawnControl;

  private tick: number;
  oldTimeStamp: number; // TODO
  private paused: boolean;

  private mousePosition: Position;

  private score: number;

  constructor() {
    this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
    this.onCanvasMouseOut = this.onCanvasMouseOut.bind(this);
    this.start = this.start.bind(this);

    this.canvas = document.getElementById('game') as HTMLCanvasElement;

    // Without this, the aspect ratio inside the canvas is all messed up
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.canvas.onmousemove = this.onCanvasMouseMove;
    this.canvas.onmouseout = this.onCanvasMouseOut;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.tick = 0;
    this.oldTimeStamp = new Date().getTime();
    this.paused = true;

    this.mousePosition = createPosition(0, 0);

    this.spawnControl = new SpawnControl();

    this.score = 0;

    this.pumpa = new Pumpa();
    this.clouds = new Clouds();
    this.shark = new Shark();
    this.kycklings = new Kycklings();
  }

  public run() {
    // Wait for the preloader to finish before actually starting anything
    new Preloader().run().then(this.start);
  }

  public getCtx() {
    return this.ctx;
  }

  public getPumpa(): Pumpa {
    return this.pumpa;
  }

  public getClouds(): Clouds {
    return this.clouds;
  }

  public getShark(): Shark {
    return this.shark;
  }

  public getKicklings(): Kycklings {
    return this.kycklings;
  }

  public getSpawnControl(): SpawnControl {
    return this.spawnControl;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public getScore(): number {
    return this.score;
  }

  public getMousePosition(): Position {
    return this.mousePosition;
  }

  public incrementScore() : void {
    this.score++;
  }

  public incrementTick(): void {
    this.tick++;
  }

  private start() {
    startGameLoop(this);
  }

  private onCanvasMouseMove(event: MouseEvent) {
    if (this.paused) {
      this.paused = false;
      return
    }

    const canvasRelativeOffset = this.canvas.getBoundingClientRect();
    this.mousePosition = createPosition(
      event.clientX - canvasRelativeOffset.left,
      event.clientY - canvasRelativeOffset.top,
    );
  }

  private onCanvasMouseOut() {
    this.paused = true;
  }
}
