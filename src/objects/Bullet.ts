import {Scene} from "phaser";

const BULLET = 'bullet.png'
const BULLET_SPEED = 400;
const BULLET_ANIM = 'bullet';

export class Bullet extends Phaser.GameObjects.Sprite {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, BULLET);
    }

    static preload(scene: Scene) {
        const { load } = scene;

        load.spritesheet(
            BULLET,
            ASSETS_DIR + BULLET,
            {
                frameWidth: 10,
                frameHeight: 17,
            },
        );
    }

    create() {
        const { physics, anims } = this.scene;

        physics.add.existing(this, false);

        const body = (this.body as Phaser.Physics.Arcade.Body);

        body.setVelocityY(-BULLET_SPEED);
        body.collideWorldBounds = true;
        body.onWorldBounds = true;
        body.setBoundsRectangle(new Phaser.Geom.Rectangle(
            physics.world.bounds.x - this.width,
            physics.world.bounds.y - this.height,
            physics.world.bounds.width + this.width,
            physics.world.bounds.height + this.height,
        ));

        if (!anims.exists(BULLET_ANIM)) {
            anims.create({
                key: BULLET_ANIM,
                frames: anims.generateFrameNumbers(BULLET, { frames: [0, 1, 2, 3] }),
                frameRate: 5,
                repeat: -1,
            });
        }

        this.play(BULLET_ANIM);
    }

    onWorldBounds() {
        this.destroy();
    }
}
