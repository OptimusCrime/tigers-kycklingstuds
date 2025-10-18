import {Position, Size} from "./types";

export const createPosition = (x: number, y: number): Position => ({ x, y });
export const createSize = (width: number, height: number): Size => ({ width, height });

export const degreesToRad = (degrees: number): number => Math.PI / 180 * degrees;
export const randomizeDistance = (): number => 3 + Math.floor(Math.random() * 1.3333);
