import {Enemy} from "../../objects/game/Enemy.ts";
import {ENEMY_EDGE_OFFSET} from "../../const.ts";

// Траектория движения врага
enum EMovementPattern {
    Linear = 'linear',
    Sine = 'sine',
}

// Направление движения врага
enum EMovementDirection {
    Down = 'down',
    Up = 'up',
    Left = 'left',
    Right = 'right',

    UpRight = 'upRight',
    UpLeft = 'upLeft',
}

// Параметры движения врага
interface BaseMovementParams {
    pattern: EMovementPattern;
    direction: EMovementDirection;
    speed: number;
}

// Параметры движения врага по линейной траектории
interface LinearMovementParams extends BaseMovementParams {
    pattern: EMovementPattern.Linear;
}

// Параметры движения врага по синусоидальной траектории
interface SineMovementParams extends BaseMovementParams {
    pattern: EMovementPattern.Sine;
    amplitude: number,
    frequency: number,
}

// Параметры движения врага
export type TMovementParams = LinearMovementParams | SineMovementParams;

/**
 * Система движения врагов
 *
 * Кроме движения умеет вращать врагов и проверять, вышли ли они за пределы игры
 */
export class EnemyMovementSystem {
    /**
     * Установить недостающие параметры по-умолчанию
     * @param params
     */
    static normalizeParamsWithDefaults(params: TMovementParams): TMovementParams {
        params.direction ??= EMovementDirection.Down;

        switch (params.pattern) {
            case EMovementPattern.Sine:
                params.frequency ??= 10;
                params.amplitude ??= 10;
                break;
        }

        return params;
    }

    /**
     * Проверить, не находится ли враг за пределами экрана
     * @param enemy
     * @param direction
     */
    static isOutOfBounds(enemy: Enemy, direction: EMovementDirection): boolean {
        switch (direction) {
            case EMovementDirection.Down:
                return enemy.y > enemy.scene.cameras.main.height + ENEMY_EDGE_OFFSET;
            case EMovementDirection.Left:
                return enemy.x < -ENEMY_EDGE_OFFSET;
            case EMovementDirection.Up:
                return enemy.y < -ENEMY_EDGE_OFFSET;
            case EMovementDirection.Right:
                return enemy.x > enemy.scene.cameras.main.width + ENEMY_EDGE_OFFSET;
            case EMovementDirection.UpRight:
                return enemy.y < -ENEMY_EDGE_OFFSET || enemy.x > enemy.scene.cameras.main.width + ENEMY_EDGE_OFFSET;
            case EMovementDirection.UpLeft:
                return enemy.y < -ENEMY_EDGE_OFFSET || enemy.x < -ENEMY_EDGE_OFFSET;
            default:
                throw `Ошибка: не предусмотрено направление ${direction}`;
        }
    }

    /**
     * Повернуть врага по направлению движения
     * @param enemy
     * @param params
     */
    static applyRotate(enemy: Enemy, params: TMovementParams): void {
        enemy.angle = this.directionToAngle(params.direction);
    }

    /**
     * Предвычисляем всё что можем, чтобы меньше работы делать в цикле обновления
     * @param params
     * @param precomputedParams
     */
    static precomputeMovementParams(params: TMovementParams, precomputedParams: Record<string, any>): void {
        switch (params.pattern) {
            case EMovementPattern.Linear:
                return this.precomputeLinearMovementParams(params, precomputedParams);
            case EMovementPattern.Sine:
                return this.precomputeSineMovementParams(params, precomputedParams);
        }
    }

    /**
     * Получить угол в градусах в зависимости от указанного направления
     * @param direction
     * @protected
     */
    protected static directionToAngle(direction: EMovementDirection): number {
        const directionToAngle = {
            [EMovementDirection.Down]: 90,
            [EMovementDirection.Left]: 180,
            [EMovementDirection.Up]: 270,
            [EMovementDirection.Right]: 0,

            [EMovementDirection.UpRight]: -45,
            [EMovementDirection.UpLeft]: -135,
        };

        return directionToAngle[direction];
    }

    /**
     * Предвычисление параметров линейного движения
     * @param params
     * @param precomputedParams
     * @protected
     */
    protected static precomputeLinearMovementParams(params: LinearMovementParams, precomputedParams: Record<string, any>): void {
        // Угол движения
        const angle = Phaser.Math.DegToRad(this.directionToAngle(params.direction));

        // Базовое движение вперед по заданному углу
        precomputedParams['vx'] = (Math.cos(angle) * params.speed).toFixed(2);
        precomputedParams['vy'] = (Math.sin(angle) * params.speed).toFixed(2);
    }

    /**
     * Предвычисление параметров движения по синусоиде
     * @param params
     * @param precomputedParams
     * @protected
     */
    protected static precomputeSineMovementParams(params: SineMovementParams, precomputedParams: Record<string, any>): void {
        // Угол движения
        const angle = Phaser.Math.DegToRad(this.directionToAngle(params.direction));

        // Базовое движение вперед по заданному углу
        precomputedParams['vx'] = (Math.cos(angle) * params.speed).toFixed(2);
        precomputedParams['vy'] = (Math.sin(angle) * params.speed).toFixed(2);

        // Перпендикулярное направление для синусоиды (угол + 90 градусов)
        precomputedParams['perpAngle'] = angle + Math.PI / 2;
    }

    /**
     * Применить движение к врагу. Не манипулирует скоростью физ. тела, а перемещает врага в пространстве
     * @param enemy
     * @param params
     * @param precomputedParams
     */
    static applyMovement(enemy: Enemy, params: TMovementParams, precomputedParams: Record<string, any>): void {
        switch (params.pattern) {
            case EMovementPattern.Linear:
                return this.applyLinearMovement(enemy, params, precomputedParams);
            case EMovementPattern.Sine:
                return this.applySineMovement(enemy, params, precomputedParams);
        }
    }

    /**
     * Сдвинуть врага по линейной траектории
     * @param enemy
     * @param _
     * @param precomputedParams
     * @protected
     */
    protected static applyLinearMovement(enemy: Enemy, _: LinearMovementParams, precomputedParams: Record<string, any>): void {
        enemy.x += precomputedParams['vx'] * enemy.scene.game.loop.delta;
        enemy.y += precomputedParams['vy'] * enemy.scene.game.loop.delta;
    }

    /**
     * Сдвинуть врага по синусоидальной траектории
     * @param enemy
     * @param params
     * @param precomputedParams
     * @protected
     */
    protected static applySineMovement(enemy: Enemy, params: SineMovementParams, precomputedParams: Record<string, any>): void {
        // смещение по синусоиде
        const waveOffset =
            Math.sin(enemy.scene.game.loop.time * params.frequency)
            * params.amplitude
            * (enemy.scene.game.loop.delta / 1000);

        enemy.x += precomputedParams['vx'] * enemy.scene.game.loop.delta + Math.cos(precomputedParams['perpAngle']) * waveOffset;
        enemy.y += precomputedParams['vy'] * enemy.scene.game.loop.delta + Math.sin(precomputedParams['perpAngle']) * waveOffset;
    }
}
