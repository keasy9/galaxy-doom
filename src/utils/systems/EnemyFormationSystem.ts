import {EnemyWave} from "../../objects/game/EnemyWave.ts";
import {Enemy} from "../../objects/game/Enemy.ts";
import {ENEMY_EDGE_OFFSET} from "../../const.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

// Позиция начала волны
export enum EWavePosition {
    TopCenter = 'topCenter',
    BottomLeft = 'bottomLeft',
    BottomRight = 'bottomRight',
}

// Паттерн построения
export enum EFormationPattern {
    Grid = 'grid',
    VShape = 'vShape',
}

/**
 * Система построений врагов
 *
 * Отвечает за построение врагов в шаблон (сетку, буквой v и пр.) или последовательность, а также размещение волны врагов на указанной позиции
 *
 * todo сейчас не учитывает направление движения врагов
 */
export class EnemyFormationSystem {
    /**
     * Преобразовать волну в последовательность спавна врагов
     * @param wave
     * @param position
     * @param delay
     *
     * todo метод не отсюда. Утащить в waveFactory или отдельный класс. Либо переименовать этот класс, например в waveInitSystem
     */
    public static applySequence(wave: EnemyWave, position: EWavePosition, delay: number): void {
        const point = this.positionToPoint(position, wave.scene.cameras.main);

        wave.list.forEach((object, index) => {
            const enemy = object as Enemy;
            enemy.setPosition(point.x, point.y);
            enemy.setActive(false);
            enemy.scene.time.addEvent({
                delay: delay * index,
                callback: () => enemy.setActive(true),
            });
        });
    }

    /**
     * Применить построение к волне врагов
     * @param wave
     * @param position
     * @param formationType
     * @param spacing
     */
    public static applyFormation(
        wave: EnemyWave,
        position: EWavePosition,
        formationType: EFormationPattern,
        spacing: number,
    ): void {
        const point = this.positionToPoint(position, wave.scene.cameras.main);

        switch (formationType) {
            case EFormationPattern.Grid:
                this.gridFormation(wave, point, spacing)
                break;
            case EFormationPattern.VShape:
                this.vFormation(wave, point, spacing)
                break;
        }
    }

    /**
     * Построить врагов сеткой
     * @param wave
     * @param position
     * @param spacing
     */
    public static gridFormation(
        wave: EnemyWave,
        position: Vector2Like,
        spacing: number,
    ): void {
        const enemyWidth = (wave.first as Enemy).width;
        const enemyHeight = (wave.first as Enemy).height;

        const gridCellWidth = enemyWidth + enemyWidth * spacing;
        const gridWidth = wave.scene.cameras.main.width - ENEMY_EDGE_OFFSET * 2;
        const itemsInRow = Phaser.Math.FloorTo(gridWidth / gridCellWidth);
        const cellHeight = enemyHeight + enemyHeight * spacing;

        // todo переписать руками чтобы центрировать когда врагов нехватает на полный ряд
        Phaser.Actions.GridAlign(wave.list, {
            cellWidth: gridCellWidth,
            cellHeight: cellHeight,
            position: Phaser.Display.Align.CENTER,
            width: itemsInRow,
            height: 99, // чтобы все кто не влез в ряд, выстраивались новыми рядами
            x: position.x - gridWidth / 2,
            y: position.y - cellHeight * Math.floor(wave.length / itemsInRow),
        });
    }

    /**
     * Построить врагов клином
     * @param wave
     * @param position
     * @param spacing
     */
    public static vFormation(
        wave: EnemyWave,
        position: Vector2Like,
        spacing: number,
    ): void {
        // угол между ветвями
        const radians = Phaser.Math.DegToRad(30);

        const hasCenter = wave.length % 2 !== 0;

        let endIndex = wave.length + 1;
        let indexOffset = 1;
        if (hasCenter) {
            const centerEnemy = wave.first as Enemy
            centerEnemy.x = position.x;
            centerEnemy.y = position.y;

            endIndex--;
            indexOffset--;
        }

        for (let i = 1; i < endIndex; i++) {
            const enemy = wave.list[i - indexOffset] as Enemy;

            const row = Math.ceil(i / 2);
            const isLeftBranch = i % 2 !== 0;

            // Рассчитываем смещение для текущего ряда
            const xOffset = (spacing * enemy.width + enemy.width) * row;
            const yOffset = (spacing * enemy.height + enemy.height) * row * Math.tan(radians);

            // Рассчитываем позиции для левой и правой ветвей
            if (isLeftBranch) {
                enemy.x = position.x - xOffset;
            } else {
                enemy.x = position.x + xOffset;
            }

            enemy.y = position.y - yOffset - row * spacing;
        }

        // Корректируем позиции для четного количества
        if (!hasCenter) {
            const offset = spacing / 2;
            wave.list.forEach((enemy, i) => {
                (enemy as Enemy).y += offset;
                if (i % 2 === 0) {
                    // правая ветка
                    (enemy as Enemy).x += spacing;
                } else {
                    (enemy as Enemy).x -= spacing;
                }
            });
        }
    }

    /**
     * Преобразовать позицию в точку на экране
     * @param position
     * @param camera
     * @protected
     */
    protected static positionToPoint(position: EWavePosition, camera: Phaser.Cameras.Scene2D.Camera): Vector2Like {
        switch (position) {
            case EWavePosition.TopCenter:
                return {x: camera.width / 2, y: ENEMY_EDGE_OFFSET};
            case EWavePosition.BottomLeft:
                return {x: -ENEMY_EDGE_OFFSET, y: camera.height + ENEMY_EDGE_OFFSET};
            case EWavePosition.BottomRight:
                return {x: camera.width + ENEMY_EDGE_OFFSET, y: camera.height + ENEMY_EDGE_OFFSET};
        }
    }
}