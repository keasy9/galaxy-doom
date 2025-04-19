import {EnemyMovementSystem, TMovementParams} from "../utils/systems/EnemyMovementSystem.ts";
import {EVENT_WAVE_COMPLETE, GAME_HEIGHT, GAME_WIDTH} from "../const.ts";
import {Scene} from "phaser";
import {SimpleEnemy} from "./enemies/SimpleEnemy.ts";
import * as Phaser from "phaser";

/**
 * Волна врагов
 *
 * Унаследована от контейнера, потому что только контейнер может участвовать в цикле обновления и содержать объекты
 *
 * Сама применяет паттерн движения ко всем врагам, уничтожает их при выходе за край игры и вызывает событие, когда волна
 * полностью уничтожена
 */
export class EnemyWave extends Phaser.GameObjects.Container {
    protected movementParams: TMovementParams;
    public precomputedMovement: Record<string, any> = {};

    protected waveIndex: number = 0;

    constructor(scene: Scene, enemies: SimpleEnemy[] = []) {
        super(scene, 0, 0, enemies);

        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;

        this.addToUpdateList();
        this.addToDisplayList();
    }

    setMovementParams(params: TMovementParams): this {
        this.movementParams = EnemyMovementSystem.normalizeParamsWithDefaults(params);

        return this;
    }

    preUpdate(time: number, delta: number) {
        super.update(time, delta);

        this.list.forEach(enemy => {
            if (!enemy.active) return;

            if (this.movementParams) {

                EnemyMovementSystem.applyMovement(enemy as SimpleEnemy, this.movementParams, this.precomputedMovement);
                if (EnemyMovementSystem.isOutOfBounds(enemy as SimpleEnemy, this.movementParams)) {
                    enemy.destroy();
                }
            }
        });

        if (this.list.length === 0) {
            this.scene.events.emit(EVENT_WAVE_COMPLETE, this.waveIndex);
            this.destroy();
        }
    }
}