import {Scene} from "phaser";
import {GuiColor, GuiFactory} from "../utils/factories/GuiFactory.ts";
import {Menu} from '../objects/gui/Menu.ts';

export const TEXTURE_MENU_BG = 'menu-bg';

export class Home extends Scene {
    protected menu: Menu;

    constructor(key: string = 'menu') {
        super(key);
    }

    create() {
        GuiFactory.init(this);

        this.input.enabled = true;

        this.add.image(0, 0, TEXTURE_MENU_BG).setOrigin(0, 0);

        const menuWidth = this.cameras.main.width / 3;
        this.menu = GuiFactory.menu({
            x: this.cameras.main.width - menuWidth,
            y: this.cameras.main.height / 2,
            width: menuWidth,
        }).with(
            GuiFactory.button({
                text: 'play',
                onclick: () => this.scene.start('level'),
                color: GuiColor.blue,
            }),
        ).align({elemsHeight: 25});
    }
}