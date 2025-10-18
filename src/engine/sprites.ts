import kycklingAir from '../sprites/kyckling/air.png';
import kycklingWalk1 from '../sprites/kyckling/walk1.png';
import kycklingWalk2 from '../sprites/kyckling/walk2.png';
import pumpa1 from '../sprites/pumpa/pumpa1.png';
import pumpa2 from '../sprites/pumpa/pumpa2.png';
import pumpa3 from '../sprites/pumpa/pumpa3.png';
import sharkLeft from '../sprites/shark/shark_left.png';
import sharkRight from '../sprites/shark/shark_right.png';
import background from '../sprites/background.png';
import cloud from '../sprites/cloud.png';
import ground from '../sprites/ground.png';
import score from '../sprites/score.png';
import water from '../sprites/water.png';
import {createPosition, createSize} from "./utilities";

const createImage = (path: string) => {
  const image = new Image();
  image.src = path;
  return image;
};

export const ScorePosition = createPosition(447, -8);
export const BackgroundPosition = createPosition(90, 132);
export const WaterPosition = createPosition(0, 296);
export const GroundHighPosition = createPosition(-40, 125);
export const GroundLowPosition = createPosition(549, 226);

// This is half of the size of the kyckling images, used
// for the rotation animation
export const KycklingHalfSize = createSize(32, 36);
export const PumpaSize = createSize(148, 101);

// This might not be the best idea I've ever had, but it makes it possible to use
// `Sprites.Cloud` etc as a fully loaded Image in the IDE with autocompletion,
// with preloading to avoid flickering in the animations.
export const Sprites = {
  KycklingAir: createImage(kycklingAir),
  KycklingWalk1: createImage(kycklingWalk1),
  KycklingWalk2: createImage(kycklingWalk2),
  Pumpa1: createImage(pumpa1),
  Pumpa2: createImage(pumpa2),
  Pumpa3: createImage(pumpa3),
  SharkLeft: createImage(sharkLeft),
  SharkRight: createImage(sharkRight),
  Background: createImage(background),
  Cloud: createImage(cloud),
  Ground: createImage(ground),
  Score: createImage(score),
  Water: createImage(water),
};

export class Preloader {
  private loadAssets(sprite: string) {
    return new Promise<void>((resolve, _) => {
      // @ts-ignore
      Sprites[sprite].onload = () => resolve();
    });
  }

  async execute() {
    return await Promise.all(
      Object.keys(Sprites).map(sprite => this.loadAssets(sprite))
    );
  }
}
