import * as Phaser from 'phaser';
import { flashElement } from '../helpers/text.helper';

export class ThankYouForPlayingText extends Phaser.GameObjects.Text {
  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'Thank you for playing!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '40px',
      align: 'center',
      shadow: {
        blur: 0,
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        fill: true,
      },
    });

    this.x = this.x - this.displayWidth / 2;
  }
}
