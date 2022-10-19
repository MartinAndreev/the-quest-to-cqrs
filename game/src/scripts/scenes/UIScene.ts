import { scenes } from '../constants';
import * as Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  private showObjectives: boolean = false;
  private objectivesGroup: Phaser.GameObjects.Group;

  constructor() {
    super(scenes.ui);
  }

  public create() {
    this.objectivesGroup = this.add.group([]);
  }
}
