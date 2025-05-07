import {Scene} from "phaser";
import {GuiManager} from "../utils/managers/GuiManager.ts";
import {Menu} from '../objects/gui/Menu.ts';
import {GuiColor, GuiFactory} from "../utils/factories/GuiFactory.ts";
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
        this.mainMenu = GuiFactory.menu({
            x: this.cameras.main.width,
            y: this.cameras.main.height / 2,
            width: menuWidth,
        }).with(
            GuiFactory.button({
                text: Translator.get('play'),
                onclick: () => SceneManager.fadeTo('level'),
                color: GuiColor.blue,
            }),
            GuiFactory.button({
                text: Translator.get('settings'),
                onclick: () => console.log('settings'),
                color: GuiColor.blue,
            }),
        ).render();

        GuiManager.flickerEffect(this.mainMenu);

        SoundManager.play(Sound.loop_menu_theme);

        this.tweens.add({
            targets: this.mainMenu,
            x: this.cameras.main.width - menuWidth,
            duration: 200,
        });
    }
}