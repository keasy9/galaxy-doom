import {Scene} from "phaser";
import {Enemy} from "../../objects/game/Enemy.ts";
import {EnemyMovementSystem, TMovementParams} from "../systems/EnemyMovementSystem.ts";
import {EnemyWave} from "../../objects/game/EnemyWave.ts";
import {EnemyFormationSystem, EFormationPattern, EWavePosition} from "../systems/EnemyFormationSystem.ts";
import {P_SPRITES} from "../../scenes/Boot.ts";

// Тип врагов
export enum EEnemyType {
    Fighter = 'fighter',
}

// Тип волны
enum EWaveType {
    Formation = 'formation',
    Sequence = 'sequence',
}

// Волна
interface WaveData {
    type: EWaveType;
    enemyType: EEnemyType;
    enemyCount: number;
    spawnPosition: EWavePosition;
    movement: TMovementParams;
    nextWaveIn?: number, // через сколько принудительно запустить след. волну
}

// Построение прагов
interface FormationWave extends WaveData {
    type: EWaveType.Formation;
    spacing: number;
    formation: EFormationPattern;
}

// Последовательное появление врагов из одной точки
interface SequenceWave extends WaveData {
    type: EWaveType.Sequence;
    spawnDelay: number;
}

// Волна
export type TWaveData = FormationWave | SequenceWave;

/**
 * Фабрика волн
 *
 * Создаёт и инициализирует волны
 */
export class WaveFactory {
    /**
     * Создать волну
     * @param scene
     * @param data
     */
    public static create(scene: Scene, data: TWaveData): EnemyWave {
        // 1) инициализируем волну и сразу её отключаем
        const wave = new EnemyWave(scene);
        wave.setMovementParams(data.movement)
            .setActive(false)
            .setVisible(false);

        // 2) определяем тип врага
        let enemyType: typeof Enemy;
        switch (data.enemyType) {
            case EEnemyType.Fighter:
                enemyType = Enemy;
                break;
        }

        // 3) создаём врагов и добавляем их к волне
        for (let i = 0; i < data.enemyCount; i++) {
            const enemy: Enemy = new enemyType(scene, 0, 0, 'fighter-enemy-sprite');
            enemy.play('fighter-enemy-anim');
            enemy.setVisible(true);
            enemy.addToDisplayList();

            EnemyMovementSystem.applyRotate(enemy, data.movement);

            wave.add(enemy);
        }

        EnemyMovementSystem.precomputeMovementParams(data.movement, wave.precomputedMovement);

        // 4) формируем волну
        switch (data.type) {
            case EWaveType.Sequence:
                EnemyFormationSystem.applySequence(wave, data.spawnPosition, data.spawnDelay);
                break;
            case EWaveType.Formation:
                EnemyFormationSystem.applyFormation(wave, data.spawnPosition, data.formation, data.spacing);
                break;
        }

        // 5) включаем волну
        wave.setVisible(true).setActive(true);

        return wave;
    }

    /**
     * Загружает все ресурсы, необходимые для указанного типа врагов. Создаёт анимации по окончанию загрузки
     * @param scene Сцена
     * @param type Тип врага
     * @param loader Загрузчик ресурсов
     */
    static loadAssetsForEnemy(scene: Scene, type: EEnemyType, loader: Phaser.Loader.LoaderPlugin) {
        switch (type) {
            case EEnemyType.Fighter:
                loader.spritesheet(
                    'fighter-enemy-sprite',
                    P_SPRITES + 'enemy.png',
                    {frameWidth: 16, frameHeight: 16},
                );
                loader.on(Phaser.Loader.Events.COMPLETE, () => {

                    scene.anims.create({
                        key: 'fighter-enemy-anim',
                        frames: scene.anims.generateFrameNumbers('fighter-enemy-sprite', {frames: [0, 1]}),
                        frameRate: 30,
                        repeat: -1,
                    });
                });
                break;
        }
    }
}