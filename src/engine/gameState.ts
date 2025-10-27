import { CANVAS_HEIGHT, CANVAS_WIDTH, TIMESTEP } from './constants';
import { Clouds } from './objects/clouds';
import { Kycklings } from './objects/kycklings';
import { Pumpa } from './objects/pumpa';
import { Shark } from './objects/shark';
import { Tiger } from './objects/tiger';
import { Tombstones } from './objects/tombstones';
import { SpawnControl } from './spawnControl';
import {
  BackgroundPosition,
  DeadPosition,
  GroundHighPosition,
  GroundLowPosition,
  KycklingHalfSize,
  Preloader,
  ScorePosition,
  Sprites,
  TigerPosition,
  WaterPosition,
} from './sprites';
import { Position } from './types';
import { createPosition, degreesToRad } from './utilities';

export class GameState {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private readonly tiger: Tiger;
  private readonly pumpa: Pumpa;
  private readonly clouds: Clouds;
  private readonly shark: Shark;
  private readonly tombstones: Tombstones;
  private readonly kycklings: Kycklings;

  private readonly spawnControl: SpawnControl;

  private oldTimeStamp: number;
  private paused: boolean;

  private mousePosition: Position;

  private dead: number;
  private score: number;

  constructor() {
    this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
    this.onCanvasMouseOut = this.onCanvasMouseOut.bind(this);

    this.canvas = document.getElementById('game') as HTMLCanvasElement;

    // Without this, the aspect ratio inside the canvas is all messed up
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.canvas.onmousemove = this.onCanvasMouseMove;
    this.canvas.onmouseout = this.onCanvasMouseOut;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.oldTimeStamp = new Date().getTime();
    this.paused = true;

    this.mousePosition = createPosition(0, 0);

    this.spawnControl = new SpawnControl();

    this.score = 0;
    this.dead = 0;

    this.tiger = new Tiger();
    this.pumpa = new Pumpa();
    this.clouds = new Clouds();
    this.shark = new Shark();
    this.tombstones = new Tombstones();
    this.kycklings = new Kycklings();
  }

  public async start() {
    const preloader = new Preloader();
    await preloader.execute();

    window.requestAnimationFrame(() => this.tick());
  }

  public getPumpa(): Pumpa {
    return this.pumpa;
  }

  public getKicklings(): Kycklings {
    return this.kycklings;
  }

  public addTombstone(): void {
    return this.tombstones.add();
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public incrementScore(): void {
    this.score++;
  }

  public incrementDead(): void {
    this.dead++;
  }

  private onCanvasMouseMove(event: MouseEvent) {
    if (this.paused) {
      this.paused = false;
      return;
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

  private calculateFramesPerSecond(currentTimeStamp: number): number {
    return Math.round(1 / ((currentTimeStamp - this.oldTimeStamp) / 1000));
  }

  private calculateDelta(currentTimestamp: number): number {
    const increment = currentTimestamp - this.oldTimeStamp;
    const delta = increment / TIMESTEP;
    if (delta > 1) {
      return 1;
    }

    return delta;
  }

  private tick(): void {
    const currentTimestamp = new Date().getTime();
    const delta = this.calculateDelta(currentTimestamp);

    this.resetScene();
    this.updateMovingElements(delta);
    this.tiger.tick(delta);
    this.kycklings.tick(this, delta);
    this.tombstones.tick(delta);
    this.draw(currentTimestamp);
    this.drawTombstones();
    this.drawKycklings();

    if (!this.paused) {
      this.spawnControl.tick(this, delta);
    }

    this.oldTimeStamp = currentTimestamp;

    window.requestAnimationFrame(() => this.tick());
  }

  private resetScene(): void {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  private drawScore(): void {
    this.ctx.drawImage(Sprites.Score, ScorePosition.x, ScorePosition.y);
    this.ctx.font = 'bold 26px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Poäng: ${this.score}`, 475, 30);
  }

  private drawDead(): void {
    this.ctx.drawImage(Sprites.Score, DeadPosition.x, DeadPosition.y);
    this.ctx.font = 'bold 26px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Döda: ${this.dead}`, 279, 30);
  }

  private writeFramePerSecond(currentTimestamp: number): void {
    const fps = this.calculateFramesPerSecond(currentTimestamp);

    if (isNaN(fps)) {
      return;
    }

    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(fps.toString(), 5, 10);
  }

  private updateMovingElements(delta: number): void {
    this.pumpa.tick(delta, this.mousePosition);
    this.clouds.tick(delta);
    this.shark.tick(delta);
  }

  private draw(currentTimestamp: number): void {
    this.ctx.drawImage(Sprites.Cloud, this.clouds.getCloud1Position().x, this.clouds.getCloud1Position().y);

    // TODO implement cloud2
    this.drawScore();
    this.drawDead();

    this.ctx.drawImage(Sprites.Background, BackgroundPosition.x, BackgroundPosition.y);

    this.ctx.drawImage(this.tiger.getSprite(), TigerPosition.x, TigerPosition.y);

    this.ctx.drawImage(
      this.shark.getSprite(),
      Math.trunc(this.shark.getPosition().x),
      Math.trunc(this.shark.getPosition().y),
    );

    this.ctx.drawImage(Sprites.Water, WaterPosition.x, WaterPosition.y);

    this.ctx.drawImage(Sprites.Ground, GroundHighPosition.x, GroundHighPosition.y);

    this.ctx.drawImage(Sprites.Ground, GroundLowPosition.x, GroundLowPosition.y);

    this.ctx.drawImage(this.pumpa.getSprite(), this.pumpa.getPosition().x, this.pumpa.getPosition().y);

    this.writeFramePerSecond(currentTimestamp);
  }
  private drawTombstones(): void {
    this.tombstones.get().map((tombstone) => {
      const position = tombstone.getPosition();
      this.ctx.drawImage(tombstone.getSprite(), position.x, position.y);

      this.ctx.restore();
    });
  }

  private drawKycklings(): void {
    this.kycklings.get().map((kyckling) => {
      // What would StackOverflow do?
      // https://stackoverflow.com/a/46921702/921563
      this.ctx.save();

      this.ctx.translate(
        kyckling.getPosition().x + KycklingHalfSize.width,
        kyckling.getPosition().y + KycklingHalfSize.height,
      );

      this.ctx.rotate(degreesToRad(kyckling.getRotation()));
      this.ctx.translate(-KycklingHalfSize.width, -KycklingHalfSize.height);

      this.ctx.drawImage(kyckling.getSprite(), 0, 0);

      this.ctx.rotate(-degreesToRad(kyckling.getRotation()));

      this.ctx.restore();
    });
  }
}
