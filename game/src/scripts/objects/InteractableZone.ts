import * as Phaser from 'phaser';
import { Player } from './Player';

export class InteractableZone extends Phaser.GameObjects.Zone {
  private isTriggered: boolean = false;

  public constructor(
    scene: Phaser.Scene,
    private readonly player: Player,
    x: number,
    y: number,
    width: number,
    height: number,
    private readonly onEnter: (
      object1: Phaser.GameObjects.GameObject,
      object2: Phaser.GameObjects.GameObject,
    ) => void,
    private readonly triggerOnce: boolean = false,
  ) {
    super(scene, x, y, width, height);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.scene.physics.add.overlap(this.player, this, (character, zone) => {
      if (this.isTriggered && this.triggerOnce) return;

      this.isTriggered = true;
      this.onEnter(character, zone);

      setTimeout(() => {
        this.isTriggered = false;
      }, 5000);
    });
  }
}
