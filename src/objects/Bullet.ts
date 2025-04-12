import {Scene} from "phaser";
import {P_SPRITES} from "../const.ts";
import {SceneWithCollisions} from "../scenes/level/Level.ts";
import {CollisionGroup} from "../scenes/level/CollisionManager.ts";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;

const P_BULLET = 'bullet-white.png'
const ANIM_BULLET_DIE = 'bullet-die';

export class Bullet extends Phaser.GameObjects.Sprite {
    protected static speed = 400;
    protected static color: number;

    public readonly damage = 40;

    constructor(scene: SceneWithCollisions, x: number, y: number, isFromPlayer: boolean = true) {
        super(scene, x, y, P_BULLET);

        const { physics, anims } = scene;

        this.width = this.width/2;

        physics.add.existing(this, false);

        scene.collisions.add(
            this as GameObjectWithBody,
            isFromPlayer ? CollisionGroup.player : CollisionGroup.enemy
        );

        const body = (this.body as Phaser.Physics.Arcade.Body);

        body.onWorldBounds = true;

        body.setSize(4, 8)
            .setCollideWorldBounds(true)
            .setOffset(6, 4)
            .setVelocityY(-Bullet.speed)
            .setBoundsRectangle(new Phaser.Geom.Rectangle(
                physics.world.bounds.x,
                physics.world.bounds.y - this.height,
                physics.world.bounds.width,
                physics.world.bounds.height + this.height,
            ));

        this.setTint(Bullet.color);

        if (!anims.exists(ANIM_BULLET_DIE)) {
            anims.create({
                key: ANIM_BULLET_DIE,
                frames: anims.generateFrameNumbers(P_BULLET, { frames: [1, 2, 3] }),
                frameRate: 30,
                repeat: 0,
            });
        }
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

    destroy(anim: boolean = false, fromScene?: boolean) {
        const body = (this.body as Phaser.Physics.Arcade.Body);

        body.destroy();

        if (anim) {
            body.setVelocity(0);
            this.play(ANIM_BULLET_DIE);
            this.scene.time.addEvent({
                delay: this.scene.anims.get(ANIM_BULLET_DIE).duration,
                callback: () => this.destroy(fromScene),
            });

        } else {
            super.destroy(fromScene);
        }
    }

    takeDamage(_: number): boolean
    {
        this.destroy(true);

        return true;
    }
}
