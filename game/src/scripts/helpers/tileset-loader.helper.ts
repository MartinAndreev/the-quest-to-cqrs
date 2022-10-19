import * as Phaser from 'phaser';
import { tileFiles } from '../constants';

export const initDefaultTileSets = (
  map: Phaser.Tilemaps.Tilemap,
): Phaser.Tilemaps.Tileset[] => {
  return Object.entries(tileFiles).reduce(
    (a: Phaser.Tilemaps.Tileset[], [k, v]) => {
      return [...a, map.addTilesetImage(v.replace('.png', ''), k)];
    },
    [],
  );
};
