import {Scene} from "phaser";
import {P_SPRITES} from "../../scenes/Boot.ts";

const P_EXPLOSION = 'explosion.png';
const ANIM_EXPLOSION = 'anim_explosion';

export class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number, scale: number = 1) {
        super(scene, x, y, P_EXPLOSION);

        if (!scene.anims.exists(ANIM_EXPLOSION)) {
            scene.anims.create({
                key: ANIM_EXPLOSION,
                frames: scene.anims.generateFrameNumbers(P_EXPLOSION, {frames: [0, 1, 2, 3]}),
                frameRate: 10,
                repeat: 0,
            });
        }

        this.setScale(scale);

        this.play(ANIM_EXPLOSION);
        scene.time.addEvent({
            delay: scene.anims.get(ANIM_EXPLOSION).duration,
            callback: this.destroy.bind(this),
        });
    }

    static preload(scene: Scene) {
        scene.load.spritesheet(P_EXPLOSION, P_SPRITES + P_EXPLOSION, {frameWidth: 16, frameHeight: 16});
    }
}
