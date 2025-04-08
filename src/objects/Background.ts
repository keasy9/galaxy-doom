import { Scene } from "phaser";

const BG_STARS = 'bg_stars.png';
const BG_DUST = 'bg_dust.png';
const BG_PLANETS = 'bg_planets.png';

export class Background extends Phaser.GameObjects.Layer {

    constructor(scene: Scene) {
        super(scene);
    }

    static preload(scene: Scene) {
        const { load } = scene;

        load.image(BG_STARS, P_TEXTURES + BG_STARS);
        load.image(BG_DUST, P_TEXTURES + BG_DUST);
        load.image(BG_PLANETS, P_TEXTURES + BG_PLANETS);
    }

    create() {
        const { cameras, add } = this.scene;

        this.add([
            add.image(cameras.main.width / 2, cameras.main.height, BG_STARS).setOrigin(.5, 1),
            add.image(cameras.main.width / 2, cameras.main.height, BG_DUST).setOrigin(.5, 1),
            add.image(cameras.main.width / 2, cameras.main.height, BG_PLANETS).setOrigin(.5, 1),
        ]);
    }

}