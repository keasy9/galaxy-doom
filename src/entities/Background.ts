import {Entity} from "./Entity.ts";
import Layer = Phaser.GameObjects.Layer;

const BG_STARS = 'bg_stars.png';
const BG_DUST = 'bg_dust.png';
const BG_PLANETS = 'bg_planets.png';

export class Background extends Entity {
    protected layer: Layer;

    preload() {
        const { load } = this.scene;

        load.image(BG_STARS, ASSETS_DIR + BG_STARS);
        load.image(BG_DUST, ASSETS_DIR + BG_DUST);
        load.image(BG_PLANETS, ASSETS_DIR + BG_PLANETS);
    }

    create() {
        const { cameras, add } = this.scene;

        this.layer = add.layer([
            add.image(cameras.main.width / 2, cameras.main.height, BG_STARS).setOrigin(.5, 1),
            add.image(cameras.main.width / 2, cameras.main.height, BG_DUST).setOrigin(.5, 1),
            add.image(cameras.main.width / 2, cameras.main.height, BG_PLANETS).setOrigin(.5, 1),
        ]);
    }
}