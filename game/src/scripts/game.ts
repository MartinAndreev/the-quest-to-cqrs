import * as Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './constants';
import MainScene from './scenes/MainScene';
import UIScene from './scenes/UIScene';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#354048',
  render: { pixelArt: true, antialias: false, autoResize: true },
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    orientation: Phaser.Scale.Orientation.LANDSCAPE,
  },
  scene: [PreloadScene, MenuScene, MainScene, UIScene],
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});
