import {Preloader, Sprites} from "./sprites";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants";
import {startGameLoop} from "./game_loop";
import {Position} from "./utilities";
import {Pumpa} from "./objects/pumpa";

export class Game {

  constructor() {
    this.canvas = null;
    this.ctx = null;

    this.paused = false;

    this.mousePosition = Position(0, 0);

    this.pumpa = new Pumpa();

    this._onCanvasMouseMove = this._onCanvasMouseMove.bind(this);
    this._onCanvasMouseOut = this._onCanvasMouseOut.bind(this);
    this._start = this._start.bind(this);
  }

  init() {
    this._setupCanvasAndContext();

    // Wait for the preloader to finish before actually starting anything
    new Preloader().run().then(this._start);
  }

  _start() {
    console.log(Sprites.Pumpa1);
    startGameLoop(this);
  }

  _setupCanvasAndContext() {
    this.canvas = document.getElementById('game');

    // Without this, the aspect ratio inside the canvas is all messed up
    // for some reason.
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.canvas.onmousemove = this._onCanvasMouseMove;
    this.canvas.onmouseout = this._onCanvasMouseOut;

    this.ctx = this.canvas.getContext('2d');
  }

  _onCanvasMouseMove(event) {
    if (this.paused) {
      this.paused = false;
    }
    else {
      const canvasRelativeOffset = this.canvas.getBoundingClientRect();
      this.mousePosition = Position(
        event.clientX - canvasRelativeOffset.left,
        event.clientY - canvasRelativeOffset.top,
      );
    }
  }

  _onCanvasMouseOut() {
    this.paused = true;
  }
}