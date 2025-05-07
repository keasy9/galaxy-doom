import {Scene} from "phaser";
import {Menu} from '../objects/gui/Menu.ts';
import {GuiColor} from "../utils/factories/GuiFactory.ts";
import {Translator} from "../utils/managers/Translator.ts";
import {Sound, SoundManager} from "../utils/managers/SoundManager.ts";
import {SceneManager} from "../utils/managers/SceneManager.ts";

export const TEXTURE_MENU_BG = 'menu-bg';

export class Home extends Scene {
    protected mainMenu: Menu;

    constructor(key: string = 'home') {
        super(key);
    }

    create() {
        this.input.enabled = true;

        this.add.image(0, 0, TEXTURE_MENU_BG).setOrigin(0, 0);

        const menuWidth = Math.min(this.cameras.main.width / 3, 200);
        this.mainMenu = this.gui.factory.menu({
            x: this.cameras.main.width,
            y: this.cameras.main.height / 2,
            width: menuWidth,
        }).with(
            this.gui.factory.button({
                text: Translator.get('play'),
                onclick: () => SceneManager.fadeTo('level'),
                color: GuiColor.blue,
            }),
            this.gui.factory.button({
                text: Translator.get('settings'),
                onclick: () => console.log('settings'),
                color: GuiColor.blue,
            }),
        ).render();

        this.gui.flickerEffect(this.mainMenu);

        SoundManager.play(Sound.loop_menu_theme);

        this.tweens.add({
            targets: this.mainMenu,
            x: this.cameras.main.width - menuWidth,
            duration: 200,
        });
    }
}