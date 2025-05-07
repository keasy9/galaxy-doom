import {Scene} from "phaser";
import {GuiColor, GuiFactory} from "../utils/factories/GuiFactory.ts";
import {Translator} from "../utils/managers/Translator.ts";
import {Gui} from "./plugins/Gui.ts";
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;
import {Menu} from "../objects/gui/Menu.ts";

export class Pause extends Scene {
    protected menu: Menu;
    protected isPaused: boolean = false;
    protected togglingPause: boolean = false;

    constructor(key: string = 'level') {
        super(key);
    }

    create() {
        const menuWidth = this.cameras.main.width / 3

        this.menu = GuiFactory.menu({
            x: this.cameras.main.width / 2 - menuWidth / 2,
            y: this.cameras.main.height / 2,
            width: menuWidth,
        }).with(
            GuiFactory.button({
                text: Translator.get('continue'),
                onclick: () => console.log('continue'),
                color: GuiColor.blue,
            }),
            GuiFactory.button({
                text: Translator.get('exit'),
                onclick: () => console.log('exit'),
                color: GuiColor.blue,
            }),
        ).render().setActive(false).setVisible(false).setDepth(999);

        Gui.flickerEffect(this.menu);

        this.input.keyboard?.addKey(KeyCodes.ESC).on('down', this.togglePause.bind(this));
    }

    public togglePause() {
        if (this.togglingPause) return;
        this.togglingPause = true;

        if (this.isPaused) {
            this.menu.setAlpha(1);
            this.tweens.add({
                targets: this.menu,
                alpha: 0,
                onComplete: () => {
                    this.menu.setActive(false).setVisible(false);
                    this.togglingPause = false;
                    this.isPaused = !this.isPaused;
                    this.scene.resume();
                },
                duration: 50,
            });

        } else {
            this.menu.setAlpha(0).setVisible(true);
            this.tweens.add({
                targets: this.menu,
                alpha: 1,
                onComplete: () => {
                    this.menu.setActive(true);
                    this.togglingPause = false;
                    this.isPaused = !this.isPaused;
                    this.scene.pause();
                },
                duration: 50,
            });
        }
    }
}
