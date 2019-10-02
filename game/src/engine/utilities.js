export const Position = (x, y) => ({ x, y });
export const Size = (width, height) => ({ width, height });

export const degreesToRad = degrees => Math.PI / 180 * degrees;
export const randomizeDistance = () => 3 + Math.floor(Math.random() * 1.3333);