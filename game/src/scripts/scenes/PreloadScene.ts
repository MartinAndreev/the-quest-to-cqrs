import * as Phaser from 'phaser';
import {
  apiUrl,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  scenes,
  tileFiles,
} from '../constants';

export default class PreloadScene extends Phaser.Scene {
  public readonly progressBar = {
    width: 800,
    height: 80,
    padding: 20,
  };

  public constructor() {
    super(scenes.preload);
  }

  public async preload(): Promise<void> {
    this.createLoadingBar();

    this.load.image('tiles', `assets/tilesets/tiles.png`);
    this.load.image('objective-laptop', `assets/img/object-1-laptop.png`);
    this.load.image('objective-bottle', `assets/img/object-2-bottle.png`);
    this.load.image('objective-notes', `assets/img/object-3-notes.png`);
    this.load.image('logo', 'assets/img/the-quest-to-cqrs.png');
    this.load.spritesheet('characters1', 'assets/img/modern1.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet('characters2', 'assets/img/modern2.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.tilemapTiledJSON('menu', 'assets/tileset-maps/menu-scene.json');
    this.load.tilemapTiledJSON('main', 'assets/tileset-maps/main-scene.json');
    this.load.atlas(
      'characters',
      'assets/sprites/characters.png',
      'assets/sprites/characters.json',
    );

    this.load.json('start-dialog', `${apiUrl}dialogs/start`);
  }

  private createLoadingBar(): void {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      (DEFAULT_WIDTH - this.progressBar.width) / 2,
      (DEFAULT_HEIGHT - this.progressBar.height) / 2,
      this.progressBar.width,
      this.progressBar.height,
    );

    const loadingText = this.make.text({
      x:
        (this.cameras.main.width -
          this.progressBar.width +
          this.progressBar.padding +
          20) /
        2,
      y: (this.cameras.main.height - this.progressBar.padding) / 2,
      text: 'Loading...',
      style: {
        fontFamily: '"Press Start 2P"',
        fontSize: '20px',
        color: '#fff',
      },
    });

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        (this.cameras.main.width -
          (this.progressBar.width - this.progressBar.padding)) /
          2,
        (this.cameras.main.height -
          (this.progressBar.height - this.progressBar.padding)) /
          2,
        (this.progressBar.width - this.progressBar.padding) * value,
        this.progressBar.height - this.progressBar.padding,
      );
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  public create() {
    this.scene.start(scenes.menu);
  }
}
