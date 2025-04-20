import {Enemy} from "../../objects/game/Enemy.ts";
import {ENEMY_EDGE_OFFSET, GAME_HEIGHT, GAME_WIDTH} from "../../const.ts";

enum MovementPatternType {
    linear = 'linear',
    sine = 'sine',
}

interface BaseMovementParams {
    pattern: MovementPatternType;
    speed: number;
    angle: number; // 90 - вниз
    angleRad: number;
}

interface LinearMovementParams extends BaseMovementParams {
    pattern: MovementPatternType.linear;
}

interface SineMovementParams extends BaseMovementParams {
    pattern: MovementPatternType.sine;
    amplitude: number,
    frequency: number,
}

export type TMovementParams = LinearMovementParams | SineMovementParams;

/**
 * Система движения врагов
 *
 * Кроме движения умеет вращать врагов и проверять, вышли ли они за пределы игры
 */
export class EnemyMovementSystem {
    static normalizeParamsWithDefaults(params: TMovementParams): TMovementParams {
        params.angle ??= 90;
        params.angleRad = Phaser.Math.DegToRad(params.angle);

        switch (params.pattern) {
            case MovementPatternType.sine:
                params.frequency ??= 10;
                params.amplitude ??= 10;
                break;
        }

        return params;
    }

    static isOutOfBounds(enemy: Enemy, params: TMovementParams): boolean {
        if (params.angle > 225 || params.angle <= 315) { // вниз
            return enemy.y > GAME_HEIGHT + ENEMY_EDGE_OFFSET;

        } else if (params.angle > 135 && params.angle <= 225) { // влево
            return enemy.x < -ENEMY_EDGE_OFFSET;

        } else if (params.angle > 45 && params.angle <= 135) { // вверх
            return enemy.y < -ENEMY_EDGE_OFFSET;

        } else { // вправо
            return enemy.x > GAME_WIDTH + ENEMY_EDGE_OFFSET;
        }
    }

    static applyRotate(enemy: Enemy, params: TMovementParams): void {
        enemy.angle = params.angle;
    }

    /**
     * Предвычисляем всё что можем, чтобы меньше работы делать в цикле обновления
     * @param params
     * @param precomputedParams
     */
    static precomputeMovementParams(params: TMovementParams, precomputedParams: Record<string, any>): void {
        switch (params.pattern) {
            case MovementPatternType.linear:
                return this.precomputeLinearMovementParams(params, precomputedParams);
            case MovementPatternType.sine:
                return this.precomputeSineMovementParams(params, precomputedParams);
        }
    }

    protected static precomputeLinearMovementParams(params: LinearMovementParams, precomputedParams: Record<string, any>): void {
        // Базовое движение вперед по заданному углу
        precomputedParams['vx'] = Math.cos(params.angleRad) * params.speed;
        precomputedParams['vy'] = Math.sin(params.angleRad) * params.speed;
    }

    protected static precomputeSineMovementParams(params: SineMovementParams, precomputedParams: Record<string, any>): void {
        // Базовое движение вперед по заданному углу
        precomputedParams['vx'] = Math.cos(params.angleRad) * params.speed;
        precomputedParams['vy'] = Math.sin(params.angleRad) * params.speed;

        // Перпендикулярное направление для синусоиды (угол + 90 градусов)
        precomputedParams['perpAngle'] = params.angleRad + Math.PI/2;
    }

    static applyMovement(enemy: Enemy, params: TMovementParams, precomputedParams: Record<string, any>): void {
        switch (params.pattern) {
            case MovementPatternType.linear:
                return this.applyLinearMovement(enemy, params, precomputedParams);
            case MovementPatternType.sine:
                return this.applySineMovement(enemy, params, precomputedParams);
        }
    }

    protected static applyLinearMovement(enemy: Enemy, _: LinearMovementParams, precomputedParams: Record<string, any>): void {
        enemy.x += precomputedParams['vx'] * enemy.scene.game.loop.delta;
        enemy.y += precomputedParams['vy'] * enemy.scene.game.loop.delta;
    }

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
