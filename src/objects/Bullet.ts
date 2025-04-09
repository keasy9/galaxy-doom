import {Scene} from "phaser";

const P_BULLET = 'bullet-white.png'

export class Bullet extends Phaser.GameObjects.Sprite {
    protected static speed = 400;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, P_BULLET);
    }

    static preload(scene: Scene) {
        const { load } = scene;

        load.spritesheet(
            P_BULLET,
            P_SPRITES + P_BULLET,
            { frameWidth: 8, frameHeight: 8 },
        );
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

        body.setSize(this.width, this.height)
            .setOffset(2, 0);

        this.setTint(Phaser.Display.Color.GetColor(0, 200, 255));
    }

    onWorldBounds() {
        this.destroy();
    }
}
