import {Scene} from "phaser";
import Container = Phaser.GameObjects.Container;
import Graphics = Phaser.GameObjects.Graphics;
import BitmapText = Phaser.GameObjects.BitmapText;
import {FontSize, GuiFactory} from "../../utils/factories/GuiFactory.ts";

export class Progressbar extends Container {
    protected bar: Graphics;
    protected bg: Graphics;
    protected text: BitmapText;

    constructor(
        public scene: Scene,
        public x: number,
        public y: number,
        public height: number,
        public width: number,
        color: number,
        protected progress: number = 0,
        bgColor: number|null = null,
    ) {
        super(scene, x, y);

        if (bgColor) {
            this.bg = new Graphics(scene)
                .fillStyle(bgColor)
                .fillRect(width/-2, height/-2, width, height);

            this.add(this.bg);
        }

        this.bar = new Graphics(scene)
            .fillStyle(color)
            .fillRect(width/-2, height/-2, progress * width, height);

        this.add(this.bar);

        scene.add.existing(this);
    }

    public setProgress(progress: number): this {
        this.progress = progress;
        this.bar
            .fillRect(this.width/-2, this.height/-2, progress * this.width, this.height)

        if (this.text) this.text.setText(Math.ceil(this.progress * 100) + '%');

        return this;
    }

    public printProgress(fontSize?: FontSize): this {
        this.text = GuiFactory.text({x: this.x, y: this.y, text: Math.ceil(this.progress * 100) + '%', fontSize});

        return this;
    }

    public destroy(): void {
        this.bg?.destroy();
        this.text?.destroy();

        this.setProgress(1);

        this.scene.tweens.add({
           targets: this.bar,
           alpha: 0,
           duration: 100,
           onComplete: () => {
               this.bar.destroy();
               super.destroy();
           },
        });
    }
}