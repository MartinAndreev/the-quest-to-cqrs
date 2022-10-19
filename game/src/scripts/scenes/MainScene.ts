import * as Phaser from 'phaser';
import { scenes } from '../constants';
import {
  Character,
  InteractableZone,
  Player,
  ThankYouForPlayingText,
} from '../objects';
import { DialogBuilderService, DialogService } from '../services';
import { ApiDialogType, DialogType } from '../types';
import { Orientation } from '../enums';
import { PatrolState } from '../state';
import { ObjectivesService } from '../services/ObjectivesService';
import { ObjectivesApiService } from '../services/ObjectivesApiService';
import { BaseObjective } from '../objects/BaseObjective';

// @todo: Load from api

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private boss!: Character;
  private colleague!: Character;
  private dialogService!: DialogService;
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected allowMovement: boolean = false;
  protected layers: Phaser.Tilemaps.TilemapLayer[] = [];
  protected exitZone!: InteractableZone;
  protected startDialog!: ApiDialogType[];
  protected dialogBuilderService!: DialogBuilderService;
  protected objectivesService!: ObjectivesService;
  protected allItemsCollected: boolean = false;
  protected objectivesApiService!: ObjectivesApiService;
  protected shouldUpdateObjectives: boolean = false;
  protected objectivesInstance?: { destroy: () => void } | null;

  constructor() {
    super(scenes.main);
  }

  public preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.startDialog = this.cache.json.get('start-dialog');
    this.dialogBuilderService = new DialogBuilderService();
    this.dialogService = new DialogService(this);
    this.objectivesService = new ObjectivesService(this);
    this.objectivesApiService = new ObjectivesApiService();
  }

  public async create() {
    const map = this.make.tilemap({ key: 'main' });
    this.scene.launch(scenes.ui);

    this.layers = this.loadLayers(map);

    const [exitZoneObject] = map.getObjectLayer('Exit').objects;
    const objectivesSpawnPoints = map.getObjectLayer('Items').objects;
    const [playerSpawnPoint, bossSpawnPoint, colleagueSpawnPoint] =
      map.getObjectLayer('Spawn Points').objects;

    this.player = new Player(
      this,
      playerSpawnPoint.x as number,
      playerSpawnPoint.y as number,
      Orientation.Down,
      this.layers,
    );

    this.boss = new Character(
      this,
      bossSpawnPoint.x as number,
      bossSpawnPoint.y as number,
      'npc-2',
      Orientation.Down,
      this.layers,
    );

    this.colleague = new Character(
      this,
      colleagueSpawnPoint.x as number,
      colleagueSpawnPoint.y as number,
      'npc-1',
      Orientation.Down,
      this.layers,
    );

    const bossPatrolPoints = map.getObjectLayer(
      'NPC - Boss - Patrol Path',
    ).objects;

    this.boss.setStates([new PatrolState(this.boss, this, bossPatrolPoints)]);
    this.boss.startState(PatrolState.state);

    this.cameras.main.setBounds(0, 0, 1920, 2400);
    this.physics.world.setBounds(0, 0, 1920, 2400);

    this.cameras.main.startFollow(this.player);
    this.buildExitZone(exitZoneObject);
    this.loadObjectives(objectivesSpawnPoints);
    this.createInitialDialog();
    this.initSSEListener();
  }

  private async updateObjectives() {
    if (this.objectivesInstance) {
      this.objectivesInstance.destroy();
    }

    const objectives = await this.objectivesApiService.getObjectives();
    this.objectivesInstance = this.objectivesService.createList(objectives);
  }

  public initDialog(dialog: DialogType, onComplete: () => void) {
    const dialogInstance = this.dialogService.createDialog(
      dialog.text,
      dialog.actor as string,
    );

    setTimeout(() => {
      dialogInstance.destroy();

      if (dialog.next) {
        this.initDialog(dialog.next, onComplete);
      } else {
        onComplete();
      }
    }, dialog.delay);
  }

  public createInitialDialog() {
    const startDialog = this.dialogBuilderService.build(this.startDialog);

    this.initDialog(startDialog, () => {
      this.allowMovement = true;
      this.shouldUpdateObjectives = true;
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
      'Decorations - Misc',
    ].reduce((a: Phaser.Tilemaps.TilemapLayer[], s: string) => {
      const layer = map.createLayer(s, tileset, 0, 0);

      map.setCollisionByProperty({ collides: true });

      if (s === 'Walls') {
        console.log(layer.width, layer.height);
      }

      return [...a, layer];
    }, []);
  }

  public async update(time: number, delta: number) {
    super.update(time, delta);

    if (this.shouldUpdateObjectives) {
      await this.updateObjectives();

      this.shouldUpdateObjectives = false;
    }

    if (!this.cursors || !this.player || !this.allowMovement) return;

    this.updateMovement();
  }

  public updateMovement() {
    const speed = 100;

    const x =
      this.cursors.left?.isDown || this.cursors.right?.isDown
        ? this.cursors.left?.isDown
          ? -speed
          : speed
        : 0;
    const y =
      this.cursors.up?.isDown || this.cursors.down?.isDown
        ? this.cursors.up?.isDown
          ? -speed
          : speed
        : 0;

    this.player.setVelocity(x, y);
  }

  private loadObjectives(
    objectivesSpawnPoints: Phaser.Types.Tilemaps.TiledObject[],
  ) {
    const onEnter = (id) => async () => {
      const instance = this.dialogService.createDialog(
        `Finally found my ${id}`,
        'Player',
      );

      await this.objectivesApiService.updateObjective(id);

      setTimeout(() => {
        instance.destroy();
      }, 5000);
    };

    objectivesSpawnPoints.forEach((o) => {
      new BaseObjective(
        this,
        this.player,
        o.x as number,
        o.y as number,
        onEnter(o.name),
        o.name,
      );
    });
  }

  private buildExitZone(exitZoneObject: Phaser.Types.Tilemaps.TiledObject) {
    this.exitZone = new InteractableZone(
      this,
      this.player,
      (exitZoneObject.x as number) + (exitZoneObject.width as number) / 2,
      (exitZoneObject.y as number) + (exitZoneObject.height as number) / 2,
      exitZoneObject.width as number,
      exitZoneObject.height as number,
      () => {
        if (!this.allItemsCollected) {
          const instance = this.dialogService.createDialog(
            "I can't leave yet. I need to get my things.",
            'Player',
          );

          setTimeout(() => {
            instance.destroy();
          }, 5000);

          return;
        }

        this.allowMovement = false;
        this.player.setVelocity(0, 0);

        const screenCenterX =
          this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY =
          this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.existing(
          new ThankYouForPlayingText(this, screenCenterX, screenCenterY),
        );
      },
      true,
    );
  }

  public initSSEListener() {
    const eventSource = new EventSource(this.objectivesApiService.getSSEUrl());

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.event) {
        case 'objectives.updated':
          this.shouldUpdateObjectives = true;
          break;
        case 'objectives.completed':
          this.allItemsCollected = true;
          break;
      }
    };
  }
}
