import { Character } from './Chatacter';
import Phaser from 'phaser';
import { Orientation } from '../enums';

export class Player extends Character {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    orientation: Orientation = Orientation.Down,
    colliders?: Phaser.Tilemaps.TilemapLayer[],
  ) {
    super(scene, x, y, 'player', orientation, colliders);
  }
}
