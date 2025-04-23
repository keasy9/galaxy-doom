import {Scene} from "phaser";
import Group = Phaser.GameObjects.Group;

export const TEXTURE_MENU_BG = 'menu-bg';

export class Menu extends Scene {
    protected buttons: Group;

    constructor(key: string = 'menu') {
        super(key);
    }

    create() {
        this.add.image(0, 0, TEXTURE_MENU_BG).setOrigin(0, 0);

        //this.scene.start('level');
    }
}