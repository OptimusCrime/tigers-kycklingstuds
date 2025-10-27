import background from '../sprites/background.png';
import cloud from '../sprites/cloud.png';
import ground from '../sprites/ground.png';
import kycklingAir from '../sprites/kyckling/air.png';
import kycklingWalk1 from '../sprites/kyckling/walk1.png';
import kycklingWalk2 from '../sprites/kyckling/walk2.png';
import pumpa1 from '../sprites/pumpa/pumpa1.png';
import pumpa2 from '../sprites/pumpa/pumpa2.png';
import pumpa3 from '../sprites/pumpa/pumpa3.png';
import score from '../sprites/score.png';
import sharkLeft from '../sprites/shark/shark_left.png';
import sharkRight from '../sprites/shark/shark_right.png';
import tiger1 from '../sprites/tiger/1.png';
import tiger2 from '../sprites/tiger/2.png';
import tiger3 from '../sprites/tiger/3.png';
import tiger4 from '../sprites/tiger/4.png';
import tiger5 from '../sprites/tiger/5.png';
import tiger6 from '../sprites/tiger/6.png';
import tiger7 from '../sprites/tiger/7.png';
import tiger8 from '../sprites/tiger/8.png';
import tiger9 from '../sprites/tiger/9.png';
import tiger10 from '../sprites/tiger/10.png';
import tiger11 from '../sprites/tiger/11.png';
import tiger12 from '../sprites/tiger/12.png';
import tiger13 from '../sprites/tiger/13.png';
import tiger14 from '../sprites/tiger/14.png';
import tiger15 from '../sprites/tiger/15.png';
import tiger16 from '../sprites/tiger/16.png';
import tiger17 from '../sprites/tiger/17.png';
import tombstone1 from '../sprites/tombstone/1.png';
import tombstone2 from '../sprites/tombstone/2.png';
import tombstone3 from '../sprites/tombstone/3.png';
import tombstone4 from '../sprites/tombstone/4.png';
import tombstone5 from '../sprites/tombstone/5.png';
import tombstone6 from '../sprites/tombstone/6.png';
import tombstone7 from '../sprites/tombstone/7.png';
import water from '../sprites/water.png';
import { createPosition, createSize } from './utilities';

const createImage = (path: string) => {
  const image = new Image();
  image.src = path;
  return image;
};

export const TigerPosition = createPosition(556, 129);
export const ScorePosition = createPosition(447, -8);
export const DeadPosition = createPosition(253, -8);
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
  Tiger1: createImage(tiger1),
  Tiger2: createImage(tiger2),
  Tiger3: createImage(tiger3),
  Tiger4: createImage(tiger4),
  Tiger5: createImage(tiger5),
  Tiger6: createImage(tiger6),
  Tiger7: createImage(tiger7),
  Tiger8: createImage(tiger8),
  Tiger9: createImage(tiger9),
  Tiger10: createImage(tiger10),
  Tiger11: createImage(tiger11),
  Tiger12: createImage(tiger12),
  Tiger13: createImage(tiger13),
  Tiger14: createImage(tiger14),
  Tiger15: createImage(tiger15),
  Tiger16: createImage(tiger16),
  Tiger17: createImage(tiger17),
  Tombstone1: createImage(tombstone1),
  Tombstone2: createImage(tombstone2),
  Tombstone3: createImage(tombstone3),
  Tombstone4: createImage(tombstone4),
  Tombstone5: createImage(tombstone5),
  Tombstone6: createImage(tombstone6),
  Tombstone7: createImage(tombstone7),
} as Record<string, HTMLImageElement>;

export class Preloader {
  private loadAssets(sprite: string) {
    return new Promise<void>((resolve, _) => {
      Sprites[sprite].onload = () => resolve();
    });
  }

  async execute() {
    return await Promise.all(Object.keys(Sprites).map((sprite) => this.loadAssets(sprite)));
  }
}
