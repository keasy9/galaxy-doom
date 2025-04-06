import {Entity, TPhysicsObject} from "./Entity.ts";

/**
 * для врагов уже нужен продюсер уровней, чтобы не хардкодить траекторию движения и типы врагов
 *
 * todo поискать примеры, как это делается в других играх этого жанра
 */

export class Enemy extends Entity {
    protected object: TPhysicsObject;
}