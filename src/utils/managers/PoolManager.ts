import Group = Phaser.GameObjects.Group;
import {Scene} from "phaser";
import {Bullet} from "../../objects/Bullet.ts";
import {SimpleEnemy} from "../../objects/enemies/SimpleEnemy.ts";
import {IRecyclable} from "../../objects/interfaces/IRecyclable.ts";
import Body = Phaser.Physics.Arcade.Body;

export enum Pool {
    bullets = 'bullets',
    enemies = 'enemies',
}

export class PoolManager {
    protected static pools: Record<string, Group> = {};
    protected static scene: Scene;

    public static init(scene: Scene): PoolManager {
        this.scene = scene;

        return this;
    }

    protected static getPool(pool: Pool): Group {
        if (!(pool in this.pools)) {
            this.pools[pool] = this.scene.add.group();
        }

        return this.pools[pool];
    }

    public static get(pool: Pool, ...params: any[]): IRecyclable {
        const poolGroup = this.getPool(pool);
        let object: IRecyclable = poolGroup.getFirstDead();
        if (object) {
            object.recycle(...params);
            object.setActive(true);

            if ('visible' in object) object.visible = true;

            this.scene.physics.world.enable(object);

        } else {
            switch (pool) {
                case Pool.bullets:
                    object = new Bullet(this.scene, ...params);
                    break;
                case Pool.enemies:
                    object = new SimpleEnemy(this.scene, ...params);
                    break;
            }

            poolGroup.add(object);
            this.scene.add.existing(object);
        }

        return object;
    }

    public static return(pool: Pool, object: IRecyclable) {
        this.scene.physics.world.disable(object);
        this.getPool(pool).killAndHide(object);
    }
}