import {Scene} from "phaser";

export class Menu extends Scene {
    constructor(key: string = 'menu') {
        super(key);
    }

    create() {
        this.scene.start('level');
    }
}