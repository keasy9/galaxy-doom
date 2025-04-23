import {EnemyWave} from "../../objects/game/EnemyWave.ts";
import {Enemy} from "../../objects/game/Enemy.ts";
import {ENEMY_EDGE_OFFSET} from "../../const.ts";

enum ScreenPositionPreset {
    topCenter = 'topCenter',
    bottomLeft = 'bottomLeft',
    bottomRight = 'bottomRight',
}

type TPoint = { x: number, y: number }
export type TWavePosition = TPoint | ScreenPositionPreset;

export enum FormationPattern {
    grid = 'grid',
    circle = 'circle',
    vShape = 'v-shape',
}

/**
 * Система построений врагов
 *
 * Отвечает за построение врагов в шаблон (сетку, буквой v и пр.) или последовательность
 */
export class EnemyFormationSystem {
    public static waveToSequence(wave: EnemyWave, position: TWavePosition, delay: number): void {
        position = this.normalizePosition(position, wave.scene.cameras.main);

        wave.list.forEach((object, index) => {
            const enemy = object as Enemy;
            enemy.setPosition(position.x, position.y);
            enemy.setActive(false);
            enemy.scene.time.addEvent({
                delay: delay * index,
                callback: () => enemy.setActive(true),
            });
        });
    }

    public static waveToFormation(
        wave: EnemyWave,
        position: TWavePosition,
        formationType: FormationPattern,
        spacing: number,
    ): void {
        position = this.normalizePosition(position, wave.scene.cameras.main);

        switch (formationType) {
            case FormationPattern.grid:
                this.gridFormation(wave, position, spacing)
                break;
            case FormationPattern.vShape:
                this.vFormation(wave, position, spacing)
                break;
            case FormationPattern.circle:
                this.circleFormation(wave, position, spacing)
                break;
        }
    }

    public static gridFormation(
        wave: EnemyWave,
        position: TPoint,
        spacing: number,
    ): void {
        // todo учитывать угол
        const enemyWidth = (wave.first as Enemy).width;
        const enemyHeight = (wave.first as Enemy).height;

        const gridCellWidth = enemyWidth + spacing;
        const gridWidth = wave.scene.cameras.main.width - ENEMY_EDGE_OFFSET * 2;
        const itemsInRow = Phaser.Math.FloorTo(gridWidth / gridCellWidth);
        const cellHeight = enemyHeight + spacing;

        // todo переписать руками чтобы автоматически центрировать когда врагов нехватает на полный ряд
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

    public static vFormation(
        wave: EnemyWave,
        position: TPoint,
        spacing: number,
    ): void {
        // todo учитывать угол

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
            const xOffset = (spacing + enemy.width) * row;
            const yOffset = (spacing + enemy.height) * row * Math.tan(radians);

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

    public static circleFormation(
        wave: EnemyWave,
        position: TPoint,
        spacing: number,
    ): void {
        // todo
    }

    protected static normalizePosition(position: TWavePosition, camera: Phaser.Cameras.Scene2D.Camera): TPoint {
        if (typeof position === 'object') return position;

        switch (position) {
            case ScreenPositionPreset.topCenter:
                return {x: camera.width / 2, y: -ENEMY_EDGE_OFFSET};
            case ScreenPositionPreset.bottomLeft:
                return {x: -ENEMY_EDGE_OFFSET, y: camera.height + ENEMY_EDGE_OFFSET};
            case ScreenPositionPreset.bottomRight:
                return {x: camera.width + ENEMY_EDGE_OFFSET, y: camera.height + ENEMY_EDGE_OFFSET};
        }
    }
}