import {GAME_FPS} from "../../const.ts";
import {Bullet} from "../../objects/game/Bullet.ts";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import {SceneWithCollisions} from "../../scenes/Level.ts";
import {Pool, PoolManager} from "./PoolManager.ts";

export enum CollisionGroup {
    player = 'player',
    enemy = 'enemy',
}
/**
 * Менеджер для обработки всех столкновений
 */
export class CollisionManager {
    protected groups: Record<string, Phaser.Physics.Arcade.Group> = {};

    constructor(protected scene: SceneWithCollisions) {
        scene.physics.world.setFPS(GAME_FPS);
        scene.physics.world.on('worldBounds', this.handleBounds.bind(this));

        this.groups[CollisionGroup.player] = scene.physics.add.group();
        this.groups[CollisionGroup.enemy] = scene.physics.add.group();

        scene.physics.add.overlap(
            this.groups[CollisionGroup.player],
            this.groups[CollisionGroup.enemy],
            // @ts-ignore
            this.handlePlayerEnemyCollision.bind(this),
        );
    }

    public add(object: GameObjectWithBody, type: CollisionGroup) {
        this.groups[type].add(object);
    }

    public remove(object: GameObjectWithBody, type: CollisionGroup) {
        this.groups[type].remove(object);
    }

    protected handleBounds(body: Phaser.Physics.Arcade.Body) {
        if (body.gameObject instanceof Bullet) PoolManager.return(Pool.bullets, body.gameObject);
    }

    protected handlePlayerEnemyCollision(player: GameObjectWithBody, enemy: GameObjectWithBody) {
        // todo мб есть способ легче, например активировать тело врага только при попадании в экран
        if (!this.isVisible(player) || !this.isVisible(enemy)) return;

        const enemyDamage = enemy.damage ?? null;

        if ('damage' in player && 'takeDamage' in enemy && typeof enemy.takeDamage === 'function') {
            enemy.takeDamage(player.damage);
        }

        if (enemyDamage && 'takeDamage' in player && typeof player.takeDamage === 'function') {
            player.takeDamage(enemyDamage);
        }
    }

    protected isVisible(object) {
        const camera = object.scene.cameras.main;

        const bounds = new Phaser.Geom.Rectangle(
            object.x - (object.displayWidth * object.originX),
            object.y - (object.displayHeight * object.originY),
            object.displayWidth,
            object.displayHeight,
        );

        return Phaser.Geom.Intersects.RectangleToRectangle(camera.worldView, bounds);
    }
}