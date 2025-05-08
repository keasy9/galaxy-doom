import {Scene} from "phaser";
import {GuiColor} from "../utils/factories/GuiFactory.ts";
import {Translator} from "../utils/managers/Translator.ts";
import {Menu} from "../objects/gui/Menu.ts";
import {SceneEnum, SceneManager} from "../utils/managers/SceneManager.ts";
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export class Pause extends Scene {
    protected menu: Menu;
    protected isPaused: boolean = false;
    protected togglingPause: boolean = false;

    constructor(key: string = SceneEnum.Pause) {
        super(key);
    }

    create() {
        const menuWidth = this.cameras.main.width / 3

        this.menu = this.gui.factory.menu({
            x: this.cameras.main.width / 2 - menuWidth / 2,
            y: this.cameras.main.height / 2,
            width: menuWidth,
        }).with(
            this.gui.factory.button({
                text: Translator.get('continue'),
                onclick: () => this.togglePause(false),
                color: GuiColor.Blue,
            }),
            this.gui.factory.button({
                text: Translator.get('exit'),
                onclick: () => {
                    this.togglePause(false);
                    SceneManager.fadeTo(SceneEnum.Home); // todo сейчас ломается, потому что менеджеры инициализируются до сцены
                },
                color: GuiColor.Blue,
            }),
        ).render().setActive(false).setVisible(false).setDepth(999);

        this.gui.flickerEffect(this.menu);

        this.input.keyboard?.addKey(KeyCodes.ESC).on('down', () => this.togglePause());
    }

    public togglePause(pause?: boolean) {
        pause ??= !this.isPaused;

        if (this.togglingPause) return;

        if (pause && !this.isPaused) {
            this.togglingPause = true;
            this.menu.setAlpha(0).setVisible(true);
            this.tweens.add({
                targets: this.menu,
                alpha: 1,
                onComplete: () => {
                    // todo не работает если поставить паузу, убрать её и снова поставить
                    //  потому что сцена на паузе - tween не сработает
                    this.menu.setActive(true);
                    this.togglingPause = false;
                    this.isPaused = true;
                    this.scene.pause(SceneEnum.Level);
                    //this.scene.resume();
                },
                duration: 50,
            });

        } else if (this.isPaused) {
            this.togglingPause = true;
            this.menu.setAlpha(1);
            this.tweens.add({
                targets: this.menu,
                alpha: 0,
                onComplete: () => {
                    this.menu.setActive(false).setVisible(false);
                    this.togglingPause = false;
                    this.isPaused = false;
                    this.scene.resume(SceneEnum.Level);
                    //this.scene.pause();
                },
                duration: 50,
            });
        }
    }
}
