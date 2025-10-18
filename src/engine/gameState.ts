import { CANVAS_HEIGHT, CANVAS_WIDTH, TIMESTEP } from './constants';
import { Clouds } from './objects/clouds';
import { Kycklings } from './objects/kycklings';
import { Pumpa } from './objects/pumpa';
import { Shark } from './objects/shark';
import { SpawnControl } from './spawnControl';
import {
  BackgroundPosition,
  GroundHighPosition,
  GroundLowPosition,
  KycklingHalfSize,
  Preloader,
  ScorePosition,
  Sprites,
  WaterPosition,
} from './sprites';
import { Position } from './types';
import { createPosition, degreesToRad } from './utilities';

export class GameState {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private readonly pumpa: Pumpa;
  private readonly clouds: Clouds;
  private readonly shark: Shark;
  private readonly kycklings: Kycklings;

  private readonly spawnControl: SpawnControl;

  private oldTimeStamp: number;
  private paused: boolean;

  private mousePosition: Position;

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

    this.pumpa = new Pumpa();
    this.clouds = new Clouds();
    this.shark = new Shark();
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

  public isPaused(): boolean {
    return this.paused;
  }

  public incrementScore(): void {
    this.score++;
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
    return increment / TIMESTEP;
  }

  tick(): void {
    const currentTimestamp = new Date().getTime();
    const delta = this.calculateDelta(currentTimestamp);

    this.resetScene();
    this.updateMovingElements(delta);
    this.updateKycklings(delta);
    this.draw(currentTimestamp);
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

  private writeScoreText(): void {
    this.ctx.font = 'bold 26px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Poäng:', 486, 30);

    this.ctx.fillText(`${this.score}`, 577, 30);
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
    this.pumpa.tick(this.mousePosition);
    this.clouds.tick(delta);
    this.shark.tick(delta);
  }

  private updateKycklings(delta: number): void {
    this.kycklings.tick(this, delta);
  }

  private draw(currentTimestamp: number): void {
    this.ctx.drawImage(Sprites.Cloud, this.clouds.getCloud1Position().x, this.clouds.getCloud1Position().y);

    // TODO implement cloud2

    this.ctx.drawImage(Sprites.Score, ScorePosition.x, ScorePosition.y);

    this.writeScoreText();

    this.ctx.drawImage(Sprites.Background, BackgroundPosition.x, BackgroundPosition.y);

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
