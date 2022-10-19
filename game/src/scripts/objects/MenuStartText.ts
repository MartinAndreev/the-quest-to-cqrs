import * as Phaser from 'phaser';
import { flashElement } from '../helpers/text.helper';

export class MenuStartText extends Phaser.GameObjects.Text {
  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'Press space to start', {
      fontFamily: '"Press Start 2P"',
      fontSize: '40px',
      align: 'center',
      fixedWidth: 800,
      shadow: {
        blur: 0,
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        fill: true,
      },
    });

    flashElement(this.scene, this);
  }
}
