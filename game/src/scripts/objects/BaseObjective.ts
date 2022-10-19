import { GameObjects, Scene } from 'phaser';
import { InteractableZone } from './InteractableZone';
import { Player } from './Player';

export class BaseObjective extends GameObjects.Sprite {
  constructor(
    scene: Scene,
    player: Player,
    x: number,
    y: number,
    onEnter: () => Promise<void>,
    sprite: string,
  ) {
    super(scene, x, y, `objective-${sprite}`);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    const zone = new InteractableZone(
      this.scene,
      player,
      x,
      y + 50,
      100,
      100,
      () => {
        onEnter();

        zone.destroy();
        this.destroy();
      },
    );
  }
}
