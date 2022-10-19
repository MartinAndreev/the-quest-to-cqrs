import * as Phaser from 'phaser';
import { Animations, Orientation } from '../enums';
import { IState } from '../state';

export class Character extends Phaser.Physics.Arcade.Sprite {
  public scene: Phaser.Scene;
  protected static readonly charactersTexture = 'characters';
  protected prefix!: string;
  protected lastAnimation: Animations | null = null;
  private states: IState[] = [];
  private currentState: IState | null = null;
  public interactionZone: Phaser.GameObjects.Zone;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    prefix: string,
    orientation: Orientation = Orientation.Down,
    colliders?: Phaser.Tilemaps.TilemapLayer[],
  ) {
    super(
      scene,
      x,
      y,
      Character.charactersTexture,
      `${prefix}-${orientation}-2`,
    );

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setCollideWorldBounds(true);

    if (colliders && colliders.length > 0) {
      colliders.forEach((c) => {
        this.scene.physics.add.collider(this, c);
      });
    }

    this.body.setSize(30, 20);
    this.body.setOffset(20, 80);

    this.prefix = prefix;

    this.createAnimations(prefix);
    this.anims.play(`${prefix}-idle-down`);

    this.createInteractionZone();
  }

  public createInteractionZone(): void {
    this.interactionZone = this.scene.add.zone(this.x, this.y, 100, 100);

    this.scene.physics.world.enable(this.interactionZone);
    this.scene.add.existing(this.interactionZone);
  }

  public setStates(states: IState[]): void {
    this.states = states;
  }

  public startState(state: string): void {
    const stateObject = this.states.find((s) => s.getName() === state);

    if (!stateObject) {
      return;
    }

    if (this.currentState) {
      this.currentState.stop();
    }

    this.currentState = stateObject;
    this.currentState.start();
  }

  protected createAnimations(prefix: string) {
    ['down', 'left', 'right', 'up'].forEach((p) => {
      this.anims.create({
        key: `${prefix}-idle-${p}`,
        frames: [
          {
            key: Character.charactersTexture,
            frame: `${prefix}-${p}-2.png`,
          },
        ],
      });

      this.anims.create({
        key: `${prefix}-walk-${p}`,
        repeat: -1,
        frameRate: 5,
        frames: ['1', '2', '3', '2'].map((f) => ({
          key: Character.charactersTexture,
          frame: `${prefix}-${p}-${f}.png`,
        })),
      });
    });
  }

  public playAnimation(animation: Animations) {
    this.anims.play(`${this.prefix}-${animation}`, true);

    this.lastAnimation = animation;
  }

  public updateAnimation() {
    if (this.body.velocity.x && (this.body as any).speed) {
      if (this.body.velocity.x > 0) {
        this.playAnimation(Animations.WALK_RIGHT);
      } else {
        this.playAnimation(Animations.WALK_LEFT);
      }
    } else if (this.body.velocity.y && (this.body as any).speed) {
      if (this.body.velocity.y > 0) {
        this.playAnimation(Animations.WALK_DOWN);
      } else {
        this.playAnimation(Animations.WALK_UP);
      }
    } else {
      this.playAnimation(
        this.lastAnimation
          ? (this.lastAnimation.replace('walk', 'idle') as Animations)
          : Animations.IDLE,
      );
    }
  }

  protected updateZone() {
    this.interactionZone.x = this.x;
    this.interactionZone.y = this.y + 40;
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.currentState) {
      this.currentState.run();
    }

    this.updateAnimation();
    this.updateZone();

    this.emit('character.move', { x: this.x, y: this.y });
  }
}
