import { Scene } from "phaser";
import {P_TEXTURES} from "../../scenes/Boot.ts";

const P_STARS = 'bg-stars.png';
const P_DUST = 'bg-dust.png';
const P_PLANETS = 'bg-planets.png';

type TImageData = {
    original: Phaser.GameObjects.Image,
    copy: Phaser.GameObjects.Image,
    moveBy: number,
}

export class Background extends Phaser.GameObjects.Layer {
    protected height: number
    protected imagesAndCopies: TImageData[];

    constructor(scene: Scene) {
        super(scene);
    }

    static preload(scene: Scene) {
        const { load } = scene;

        load.image(P_STARS, P_TEXTURES + P_STARS);
        load.image(P_DUST, P_TEXTURES + P_DUST);
        load.image(P_PLANETS, P_TEXTURES + P_PLANETS);
    }

    create() {
        const { cameras, add, time } = this.scene;

        this.height = cameras.main.height;

        const stars = add.image(cameras.main.width / 2, this.height, P_STARS).setOrigin(.5, 1);
        const starsCopy = add.image(cameras.main.width / 2, this.height, P_STARS).setOrigin(.5, 1).setVisible(false).setActive(false);
        const dust = add.image(cameras.main.width / 2, this.height, P_DUST).setOrigin(.5, 1);
        const dustCopy = add.image(cameras.main.width / 2, this.height, P_DUST).setOrigin(.5, 1).setVisible(false).setActive(false);
        const planets = add.image(cameras.main.width / 2, this.height, P_PLANETS).setOrigin(.5, 1);
        const planetsCopy = add.image(cameras.main.width / 2, this.height, P_PLANETS).setOrigin(.5, 1).setVisible(false).setActive(false);

        this.add([stars, starsCopy, dust, dustCopy, planets, planetsCopy]);

        time.addEvent({
            delay: 500,
            callback: () => this.moveImages(),
            callbackScope: this,
            loop: true,
            paused: false,
        });

        this.imagesAndCopies = [
            {
                original: stars,
                copy: starsCopy,
                moveBy: 1,
            },
            {
                original: dust,
                copy: dustCopy,
                moveBy: .2,
            },
            {
                original: planets,
                copy: planetsCopy,
                moveBy: .01,
            },
        ];
    }

    moveImages() {
        this.imagesAndCopies.forEach(imageData => {
            imageData.original.y += imageData.moveBy;
            if (imageData.copy.visible) {
                imageData.copy.y += imageData.moveBy;
                if (imageData.copy.y > imageData.copy.height + this.height) {
                    imageData.copy.setVisible(false).setActive(false);
                }
            }

            if (imageData.original.y >= imageData.original.height) {
                imageData.copy.setVisible(true).setActive(true);
                imageData.copy.y = imageData.original.y;

                imageData.original.y = 0;
            }
        });
    }
}
