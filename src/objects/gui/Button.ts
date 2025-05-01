import {Scene} from "phaser";
import BitmapText = Phaser.GameObjects.BitmapText;
import Graphics = Phaser.GameObjects.Graphics;
import Container = Phaser.GameObjects.Container;
import Zone = Phaser.GameObjects.Zone;
import TweenBuilderConfig = Phaser.Types.Tweens.TweenBuilderConfig;
import {GuiColor} from "../../utils/factories/GuiFactory.ts";

/**
 * кнопка
 */
export class Button extends Container {
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

        scene.add.existing(this);
        this.setSize(width, height);

        this.hitbox.on('pointerdown', this.onclick);
        this.hitbox.on('pointerover', () => this.focus());
        this.hitbox.on('pointerout', () => this.focus(false));
    }

    public destroy(): void {
        this.text.destroy();
        this.texture.destroy();
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

    public focus(focus: boolean = true): this {
        if (this.focused === focus) return this;
        this.focused = focus;

        const tween: TweenBuilderConfig = focus ? {
            targets: this.texture,
            duration: 50,
            scaleX: 1.1,
            scaleY: 0.1,
            x: 0,
            y: this.height / 2 - this.height * 0.05,
            onComplete: () => this.texture
                .setScale(1)
                .setPosition(0, 0)
                .clear()
                .fillStyle(this.color)
                .fillRect(0, 0, this.width, this.height)
        } : {
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
        };

        this.scene.tweens.add(tween);

        return this;
    }
}
