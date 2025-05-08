import {Scene} from "phaser";
import BitmapText = Phaser.GameObjects.BitmapText;
import Graphics = Phaser.GameObjects.Graphics;
import Zone = Phaser.GameObjects.Zone;
import {Sound, SoundManager} from "../../utils/managers/SoundManager.ts";
import {GuiElement} from "./GuiElement.ts";
import {IFocusable} from "../interfaces/IFocusable.ts";
import {GuiColor} from "../../utils/factories/GuiFactory.ts";

/**
 * кнопка
 */
export class Button extends GuiElement implements IFocusable {
    protected texture: Graphics;
    protected hitbox: Zone;

    protected focused: boolean = false;

    constructor(
        public scene: Scene,
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        protected color: number,
        protected text: BitmapText,
        protected onclick: Function,
    ) {
        super(scene, x, y);

        this.texture = new Graphics(scene).setPosition(0, 0);
        this.text.setOrigin(0.5);
        this.hitbox = new Zone(this.scene, 0, 0, width, height).setOrigin(0, 0);

        this.add([this.texture, this.text, this.hitbox]);

        this.setSize(width, height);

        this.scene.gui.addFocusable(this);

        this.hitbox.on('pointerdown', this.onclick);
        this.hitbox.on('pointerover', () => this.scene.gui.focus(this));
    }

    public destroy(): void {
        this.text.destroy();
        this.texture.destroy();
        this.hitbox.destroy();
        this.scene.gui.removeFocusable(this);
        super.destroy();
    }

    public setSize(width: number, height: number): this {
        super.setSize(width, height);
        this.hitbox.setSize(width, height);

        if (width > 0 && height > 0) {
            this.hitbox.setInteractive({cursor: 'pointer'});
        } else {
            this.hitbox?.removeInteractive();
        }

        this.texture.clear()

        this.text.setPosition(width / 2, height / 2);

        return this;
    }

    public focus(): this {
        if (this.focused) return this;
        this.focused = true;

        this.texture
            .setPosition(this.width / 2, this.height / 2)
            .fillStyle(GuiColor.White)
            .fillRect(0, 0, this.width, this.height)
            .setScale(0);

        this.scene.tweens.add({
            targets: this.texture,
            duration: 100, // todo при замедлении до 5000 видно, что не выровнено по центру
            scaleX: 1.2,
            scaleY: 0.1,
            x: -this.width * 0.1,
            y: this.height / 2 - this.height * 0.05,
            onComplete: () => this.texture
                .setScale(1)
                .setPosition(0, 0)
                .clear()
                .fillStyle(this.color)
                .fillRect(0, 0, this.width, this.height)
        });

        SoundManager.play(Sound.sfx_short_glitch);

        return this;
    }

    public blur(): this {
        if (!this.focused) return this;
        this.focused = false;

        this.scene.tweens.add({
            targets: this.texture,
            duration: 50,
            scaleY: 0,
            y: this.height / 2,
            onComplete: () => this.texture.clear()
        });

        SoundManager.play(Sound.sfx_short_glitch);

        return this;
    }
}
