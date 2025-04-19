import {SceneWithCollisions} from "../../scenes/Level.ts";
import {CollisionGroup} from "../../utils/managers/CollisionManager.ts";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import {Explosion} from "../Explosion.ts";
import {IRecyclable} from "../interfaces/IRecyclable.ts";
import * as Phaser from "phaser";
import * as Phaser from "phaser";

/**
 * Враг
 *
 * Инициализирует своё физическое тело, имеет здоровье и может получать урон.
 */
export class SimpleEnemy extends Phaser.GameObjects.Sprite implements IRecyclable{
    public readonly damage = 1000;
    protected health = 100;

    constructor(scene: SceneWithCollisions, x: number, y: number, sprite: string, frame?: number) {
        super(scene, x, y, sprite, frame);

        scene.physics.add.existing(this, false);
        scene.collisions.add(this as GameObjectWithBody, CollisionGroup.enemy);

        const body = (this.body as Phaser.Physics.Arcade.Body);
        body.setCircle(this.width / 2);
    }

    takeDamage(damage: number): boolean
    {
        this.health -= damage;
        if (this.health <= 0) this.destroy();

        return true;
    }

    destroy(fromScene?: boolean) {
        this.scene.add.existing(new Explosion(this.scene, this.x, this.y));
        super.destroy(fromScene);
    }

    recycle(...args: [number?, number?, string?, number?]): IRecyclable {
        const [x, y, sprite, frame] = args;

        if (x) this.x = x;
        if (y) this.y = y;
        if (sprite) this.setTexture(sprite, frame)

        return this;
    }
}
