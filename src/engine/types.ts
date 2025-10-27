export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum AnimationFrameDirection {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}
