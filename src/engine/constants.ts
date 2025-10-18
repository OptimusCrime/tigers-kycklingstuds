export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 400;

// ChatGPT states that ActionScript 2 had a hard coded FPS of 12, but it seems to be 25 FPS.
const ACTION_SCRIPT_FRAMES_PER_SECOND = 25;
export const TIMESTEP = 1000 / ACTION_SCRIPT_FRAMES_PER_SECOND;
