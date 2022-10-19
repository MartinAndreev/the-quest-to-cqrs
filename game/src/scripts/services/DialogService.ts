import * as Phaser from 'phaser';
import { Character } from '../objects';

export class DialogService {
  public constructor(private readonly scene: Phaser.Scene) {}

  public createDialog(quote: string, name: string) {
    const container = this.scene.add.graphics({
      x: 0,
      y: 0,
    });

    container.fillStyle(0x222222, 0.7);
    container.fillRect(
      0,
      this.scene.cameras.main.height - 300,
      this.scene.cameras.main.width,
      300,
    );
    container.setScrollFactor(0);

    const actor = this.scene.add.text(
      100,
      this.scene.cameras.main.height - 280,
      name,
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '36px',
        color: '#ffffff',
        shadow: {
          blur: 0,
          offsetX: 3,
          offsetY: 3,
          color: '#000000',
          fill: true,
        },
        wordWrap: { width: this.scene.cameras.main.displayWidth - 20 },
      },
    );

    actor.setScrollFactor(0);

    const content = this.scene.add.text(
      100,
      this.scene.cameras.main.height - 190,
      quote,
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '20px',
        color: '#ffffff',
        shadow: {
          blur: 0,
          offsetX: 3,
          offsetY: 3,
          color: '#000000',
          fill: true,
        },
        wordWrap: { width: this.scene.cameras.main.displayWidth - 60 },
      },
    );

    content.setScrollFactor(0);

    return {
      destroy: () => {
        container.destroy();
        actor.destroy();
        content.destroy();
      },
    };
  }
}
