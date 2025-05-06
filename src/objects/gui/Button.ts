import {Scene} from "phaser";
import BitmapText = Phaser.GameObjects.BitmapText;
import Graphics = Phaser.GameObjects.Graphics;
import Zone = Phaser.GameObjects.Zone;
import {GuiManager} from "../../utils/managers/GuiManager.ts";
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

        this.texture = new Graphics(scene).setScale(1.2, 0);
        this.text.setOrigin(0.5);
        this.hitbox = new Zone(this.scene, 0, 0, width, height).setOrigin(0, 0);

        this.add([this.texture, this.text, this.hitbox]);

        this.setSize(width, height);

        GuiManager.addFocusable(this);

        this.hitbox.on('pointerdown', this.onclick);
        this.hitbox.on('pointerover', () => GuiManager.focus(this));
    }

    public destroy(): void {
        this.text.destroy();
        this.texture.destroy();
        GuiManager.removeFocusable(this);
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

        this.texture
            .clear()
            .fillStyle(GuiColor.white)
            .fillRect(0, 0, width, height)
            .setPosition(this.width * -0.2, this.height / 2);

        this.text.setPosition(width / 2, height / 2);

        return this;
    }

    public focus(): this {
        if (this.focused) return this;
        this.focused = true;

        this.scene.tweens.add({
            targets: this.texture,
            duration: 50,
            scaleX: 1.05,
            scaleY: 0.1,
            x: 0,
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
            scaleX: 1.2,
            scaleY: 0,
            x: this.width * -0.2,
            y: this.height / 2,
            onComplete: () => this.texture
                .clear()
                .fillStyle(GuiColor.white)
                .fillRect(this.width * -0.2, this.height / 2, this.width, this.height)
        });

        SoundManager.play(Sound.sfx_short_glitch);

        return this;
    }
}
