import {Bullet} from "../../objects/game/Bullet.ts";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import {Pool, PoolManager} from "./PoolManager.ts";
import {GAME_FPS} from "../../main.ts";
import {Scene} from "phaser";

export enum CollisionGroup {
    player = 'player',
    enemy = 'enemy',
}

/**
 * Менеджер для обработки всех столкновений
 */
export class CollisionManager {
    protected static groups: Record<string, Phaser.Physics.Arcade.Group> = {};

    /**
     * Инициализация не только менеджера, но и физики
     *
     * @param scene
     */
    public static init(scene: Scene) {
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

    /**
     * Добавить объект в физическую группу
     *
     * @param object
     * @param type
     */
    public static add(object: GameObjectWithBody, type: CollisionGroup) {
        this.groups[type].add(object);
    }

    /**
     * Удалить объект из физической группы
     *
     * @param object
     * @param type
     */
    public static remove(object: GameObjectWithBody, type: CollisionGroup) {
        this.groups[type].remove(object);
    }

    /**
     * Обработка выхода за пределы мира
     *
     * @param body
     * @protected
     */
    protected static handleBounds(body: Phaser.Physics.Arcade.Body) {
        if (body.gameObject instanceof Bullet) PoolManager.return(Pool.bullets, body.gameObject);
    }

    /**
     * Обработка столкновения игрока и врагом
     *
     * @param player
     * @param enemy
     * @protected
     */
    protected static handlePlayerEnemyCollision(player: GameObjectWithBody, enemy: GameObjectWithBody) {
        if (!this.isVisible(player) || !this.isVisible(enemy)) return;

        const enemyDamage = enemy.damage ?? null;

        if ('damage' in player && 'takeDamage' in enemy && typeof enemy.takeDamage === 'function') {
            enemy.takeDamage(player.damage);
        }

        if (enemyDamage && 'takeDamage' in player && typeof player.takeDamage === 'function') {
            player.takeDamage(enemyDamage);
        }
    }

    /**
     * Проверка, видим ли объект
     * todo отказаться в пользу включения/отключения тел
     *
     * @param object
     * @protected
     */
    protected static isVisible(object) {
        const camera = object.scene.cameras.main;

        const bounds = new Phaser.Geom.Rectangle(
            object.x - (object.displayWidth * object.originX),
            object.y - (object.displayHeight * object.originY),
            object.displayWidth,
            object.displayHeight,
        );

        return Phaser.Geom.Intersects.RectangleToRectangle(camera.worldView, bounds);
    }

    public static clear(): typeof CollisionManager {
        for (const [_, group] of Object.entries(this.groups)) {
            group.destroy(true);
        }

        this.groups = {};

        return this;
    }
}