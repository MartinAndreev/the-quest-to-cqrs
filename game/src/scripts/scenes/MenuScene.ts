import * as Phaser from 'phaser';
import { scenes } from '../constants';
import { Orientation } from '../enums';
import { MenuStartText, Player } from '../objects';
import { PatrolState } from '../state';

export default class MenuScene extends Phaser.Scene {
  private readonly offset = -200;
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected player!: Player;
  protected layers: Phaser.Tilemaps.TilemapLayer[] = [];

  constructor() {
    super(scenes.menu);
  }

  public preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  public create() {
    const map = this.make.tilemap({ key: 'menu' });

    this.layers = this.loadLayers(map);

    // bind spaces event
    this.bindKeyEvents();

    // Move to game manager

    const [spawnPoint] = map.getObjectLayer('Spawn Point').objects;
    const patrolPoints = map.getObjectLayer('Patrol Path').objects;

    this.player = new Player(
      this,
      spawnPoint.x as number,
      spawnPoint.y as number,
      Orientation.Down,
      this.layers,
    );

    this.player.setStates([new PatrolState(this.player, this, patrolPoints)]);
    this.player.startState(PatrolState.state);

    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      1,
      0.7,
    );

    this.add.existing(
      new MenuStartText(
        this,
        this.cameras.main.width / 2 - 400,
        this.cameras.main.height - 300,
      ),
    );

    this.add.sprite(this.cameras.main.width / 2, 400, 'logo');
  }

  public update(time: number, delta: number) {
    if (!this.cursors || !this.player) return;
  }

  private bindKeyEvents() {
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start(scenes.main);
    });
  }

  private loadLayers(
    map: Phaser.Tilemaps.Tilemap,
  ): Phaser.Tilemaps.TilemapLayer[] {
    const tileset = map.addTilesetImage('tiles', 'tiles');

    return [
      'Floors',
      'Walls',
      'Decorations - Bottom',
      'Decorations - Middle',
      'Decorations - Top',
      'Decorations - Non Static',
    ].reduce((a: Phaser.Tilemaps.TilemapLayer[], s: string) => {
      const layer = map.createLayer(s, tileset, 0, 0);

      map.setCollisionByProperty({ collides: true });

      return [...a, layer];
    }, []);
  }
}
