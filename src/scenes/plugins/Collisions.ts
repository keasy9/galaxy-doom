import {Bullet} from "../../objects/game/Bullet.ts";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import {Pool, PoolManager} from "../../utils/managers/PoolManager.ts";
import {Scene} from "phaser";
import {Player} from "../../objects/game/Player.ts";
import {Enemy} from "../../objects/game/Enemy.ts";
import {camera} from "../../utils/helpers/camera.ts";
import ScenePlugin = Phaser.Plugins.ScenePlugin;
import PluginManager = Phaser.Plugins.PluginManager;

export enum CollisionGroup {
    Player = 'Player',
    Enemy = 'Enemy',
}

/**
 * Менеджер для обработки всех столкновений
 */
export class Collisions extends ScenePlugin {
    protected groups: Record<string, Phaser.Physics.Arcade.Group> = {};

    constructor(protected scene: Scene, pluginManger: PluginManager, pluginKey: string) {
        super(scene, pluginManger, pluginKey);
    }

    boot() {
        super.start();

        this.systems?.events.once('ready', () => {
            this.scene.physics.world.on('worldBounds', this.handleBounds.bind(this));

            // todo отдельные группы для пуль игрока и пуль врагов
            this.groups[CollisionGroup.Player] = this.scene.physics.add.group();
            this.groups[CollisionGroup.Enemy] = this.scene.physics.add.group();

            this.scene.physics.add.overlap(
                this.groups[CollisionGroup.Player],
                this.groups[CollisionGroup.Enemy],
                (player, enemy) => {
                    this.handlePlayerEnemyCollision(player as Player, enemy as Enemy);
                },
            );
        });
    }

    /**
     * Добавить объект в физическую группу
     *
     * @param object
     * @param type
     */
    public add(object: GameObjectWithBody, type: CollisionGroup): this {
        this.groups[type].add(object);

        return this;
    }

    /**
     * Удалить объект из физической группы
     *
     * @param object
     * @param type
     */
    public remove(object: GameObjectWithBody, type: CollisionGroup): this {
        this.groups[type].remove(object);

        return this;
    }

    /**
     * Обработка выхода за пределы мира
     *
     * @param body
     * @protected
     */
    protected handleBounds(body: Phaser.Physics.Arcade.Body) {
        if (body.gameObject instanceof Bullet) PoolManager.return(Pool.bullets, body.gameObject);
    }

    /**
     * Обработка столкновения игрока и врагом
     *
     * @param player
     * @param enemy
     * @protected
     */
    protected handlePlayerEnemyCollision(player: Player, enemy: Enemy) {
        if (!(camera().isVisible(player) && camera().isVisible(enemy))) return;

        const enemyDamage = enemy.damage ?? null;

        if ('damage' in player && 'takeDamage' in enemy && typeof enemy.takeDamage === 'function') {
            enemy.takeDamage(player.damage);
        }

        if (enemyDamage && 'takeDamage' in player && typeof player.takeDamage === 'function') {
            player.takeDamage(enemyDamage);
        }
    }

    public destroy(): void {
        for (const [_, group] of Object.entries(this.groups)) {
            group.destroy(true);
        }

        this.groups = {};

        return super.destroy();
    }
}
