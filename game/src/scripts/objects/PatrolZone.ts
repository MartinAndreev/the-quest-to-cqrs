import * as Phaser from 'phaser';

export class PatrolZone extends Phaser.GameObjects.Zone {
  public next!: PatrolZone;
  public name: string;

  public constructor(
    scene: Phaser.Scene,
    name: string,
    x: number,
    y: number,
    width: number = 50,
    height: number = 50,
  ) {
    super(scene, x, y, width, height);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.name = name;
  }
}
