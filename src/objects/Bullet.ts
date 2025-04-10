import {Scene} from "phaser";

const P_BULLET = 'bullet-white.png'

export class Bullet extends Phaser.GameObjects.Sprite {
    protected static speed = 400;
    protected static color: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, P_BULLET);
    }

    static preload(scene: Scene) {
        const { load } = scene;

        load.spritesheet(
            P_BULLET,
            P_SPRITES + P_BULLET,
            { frameWidth: 16, frameHeight: 16 },
        );

        const colors = [
            [0, 200, 255],
            [255, 200, 255],
            [255, 0, 100],
            [0, 255, 100],
            [255, 255, 0],
        ];

        // @ts-ignore
        Bullet.color = Phaser.Display.Color.GetColor(...Phaser.Math.RND.pick(colors));
    }

    create() {
        this.width = this.width/2;

        const { physics } = this.scene;

        physics.add.existing(this, false);

        const body = (this.body as Phaser.Physics.Arcade.Body);

        body.setVelocityY(-Bullet.speed);
        body.collideWorldBounds = true;
        body.onWorldBounds = true;
        body.setBoundsRectangle(new Phaser.Geom.Rectangle(
            physics.world.bounds.x - this.width,
            physics.world.bounds.y - this.height,
            physics.world.bounds.width + this.width,
            physics.world.bounds.height + this.height,
        ));

        body.setSize(4, 8).setOffset(6, 4);

        this.setTint(Bullet.color);
    }

    onWorldBounds() {
        this.destroy();
    }
}
