import { IState } from './IState';
import { PatrolZone } from '../objects';
import Phaser from 'phaser';

export class PatrolState implements IState {
  protected isPatrolling: boolean = false;
  public nextZone: PatrolZone | null = null;
  protected patrolDelay: number = 5000;
  protected patrolZones: PatrolZone[] = [];

  public static readonly state = 'PatrolState';

  public constructor(
    private readonly sprite: Phaser.Physics.Arcade.Sprite,
    private readonly scene: Phaser.Scene,
    waypoints: Phaser.Types.Tilemaps.TiledObject[],
  ) {
    this.createZones(waypoints);
  }

  public start() {
    this.startPatrolling();
  }

  public stop() {
    this.sprite.setVelocity(0, 0);
  }

  public getName(): string {
    return PatrolState.state;
  }

  private startPatrolling() {
    if (!this.patrolZones.length) return;

    this.nextZone = this.patrolZones[0];
    this.isPatrolling = true;
  }

  public updatePatrol() {
    if (!this.isPatrolling || !this.nextZone) {
      this.sprite.setVelocity(0, 0);

      return;
    }

    this.scene.physics.moveTo(
      this.sprite,
      this.nextZone.x,
      this.nextZone.y - 20,
      100,
    );
  }

  public setPatrolling(isPatrolling: boolean) {
    this.isPatrolling = isPatrolling;
  }

  private createZones(waypoints: Phaser.Types.Tilemaps.TiledObject[]) {
    this.patrolZones = waypoints
      .sort((a, b) => (Number(a.name) > Number(b.name) ? 1 : -1))
      .map(
        (obj) =>
          new PatrolZone(
            this.scene,
            obj.name,
            (obj.x as number) - 10,
            (obj.y as number) - 20,
          ),
      );

    this.patrolZones = this.patrolZones.reduce(
      (zones: PatrolZone[], zone: PatrolZone, index) => {
        zone.next =
          waypoints.length <= index
            ? this.patrolZones[0]
            : this.patrolZones[index + 1];

        return [...zones, zone];
      },
      [],
    );

    this.patrolZones[this.patrolZones.length - 1].next = this.patrolZones[0];

    this.scene.physics.add.overlap(
      this.sprite,
      this.patrolZones,
      (character, zone) => {
        if (zone !== this.nextZone) {
          return;
        }

        this.setPatrolling(false);
        this.nextZone = (zone as PatrolZone).next;

        setTimeout(() => {
          this.setPatrolling(true);
        }, this.patrolDelay);
      },
    );
  }

  public run(): void {
    if (this.nextZone && (this.sprite.body as any).speed > 0) {
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        this.nextZone.x,
        this.nextZone.y,
      );

      if (distance < 2) {
        this.sprite.body.reset(this.nextZone.x, this.nextZone.y - 20);
        (this.sprite.body as any).speed = 0;
        this.isPatrolling = false;
      }
    }

    this.updatePatrol();
  }
}
