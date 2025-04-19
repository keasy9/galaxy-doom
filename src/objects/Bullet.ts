import * as Phaser from "phaser";
import {Scene} from "phaser";
import {P_SPRITES} from "../const.ts";
import {SceneWithCollisions} from "../scenes/Level.ts";
import {CollisionGroup} from "../utils/managers/CollisionManager.ts";
import {IRecyclable} from "./interfaces/IRecyclable.ts";
import {Pool, PoolManager} from "../utils/managers/PoolManager.ts";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import Body = Phaser.Physics.Arcade.Body;

const P_BULLET = 'bullet-white.png'
const ANIM_BULLET_DIE = 'bullet-die';

export class Bullet extends Phaser.GameObjects.Sprite implements IRecyclable {
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

    die(anim: boolean = false) {
        const body = (this.body as Phaser.Physics.Arcade.Body);

        body.setVelocity(0);

        if (anim) {
            this.play(ANIM_BULLET_DIE);
            this.scene.time.addEvent({
                delay: this.scene.anims.get(ANIM_BULLET_DIE).duration,
                callback: () => PoolManager.return(Pool.bullets, this),
            });

        } else {
            PoolManager.return(Pool.bullets, this)
        }
    }

    takeDamage(_: number): boolean
    {
        this.die(true);

        return true;
    }

    recycle(...args: [number?, number?, boolean?]): IRecyclable {
        let [x, y, isFromPlayer] = args;
        isFromPlayer ??= true;

        if (x) this.x = x;
        if (y) this.y = y;

        this.scene.collisions.remove(
            this as GameObjectWithBody,
            isFromPlayer ? CollisionGroup.enemy : CollisionGroup.player
        );

        this.scene.collisions.add(
            this as GameObjectWithBody,
            isFromPlayer ? CollisionGroup.player : CollisionGroup.enemy
        );

        (this.body as Body).setVelocityY(-Bullet.speed);
        this.setFrame(0);

        return this;
    }
}
