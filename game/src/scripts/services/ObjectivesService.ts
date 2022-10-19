import * as Phaser from 'phaser';
import { Objective } from '../types';

export class ObjectivesService {
  public constructor(private readonly scene: Phaser.Scene) {}

  public createList(objectives: Objective[]) {
    const container = this.scene.add.graphics({
      x: 0,
      y: 0,
    });

    container.fillStyle(0x222222, 0.7);
    container.fillRect(this.scene.cameras.main.width - 420, 10, 400, 200);

    container.setScrollFactor(0);

    const group = this.scene.add.group();

    let offset = 30;

    for (let objective of objectives) {
      const x = this.scene.cameras.main.displayWidth - 400;
      const y = offset;

      const objectiveText = this.scene.add.text(x, y, objective.label, {
        fontFamily: '"Press Start 2P"',
        fontSize: '18px',
        color: '#ffffff',
        shadow: {
          blur: 0,
          offsetX: 3,
          offsetY: 3,
          color: '#000000',
          fill: true,
        },
        wordWrap: { width: this.scene.cameras.main.displayWidth - 20 },
      });

      objectiveText.setScrollFactor(0);

      group.add(objectiveText);

      if (objective.found) {
        const strike = this.scene.add
          .rectangle(x, y + 8, objectiveText.width, 1, 0xffffff)
          .setOrigin(0, 0)
          .setScrollFactor(0);

        group.add(strike);
      }

      offset += 40;
    }

    return {
      destroy: () => {
        container.destroy();
        group.destroy(true);
      },
    };
  }
}
