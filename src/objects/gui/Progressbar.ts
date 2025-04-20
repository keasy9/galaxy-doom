import {GuiElement} from "./GuiElement.ts";
import {Scene} from "phaser";

export class Progressbar extends GuiElement {
    protected bar: Phaser.GameObjects.Graphics;
    protected bg: Phaser.GameObjects.Graphics;

    constructor(
        protected scene: Scene,
        protected x: number,
        protected y: number,
        protected height: number,
        protected width: number,
        color: number,
        progress: number = 0,
        bgColor: number|null = null,
    ) {
        super(scene, x, y);

        if (bgColor) {
            this.bg = this.scene.add.graphics()
                .fillStyle(bgColor)
                .fillRect(x - width/2, y - height/2, width, height);
        }

        this.bar = this.scene.add.graphics()
            .fillStyle(color)
            .fillRect(x - width/2, y - height/2, progress * width, height);
    }

    setProgress(progress: number): this {
        this.bar.fillRect(this.x - this.width/2, this.y - this.height/2, progress * this.width, this.height)

        return this;
    }

    destroy(): void {
        this.bg?.destroy();

        this.scene.tweens.add({
           targets: this.bar,
           alpha: 0,
           duration: 100,
           onComplete: () => this.bar.destroy(),
        });
    }
}