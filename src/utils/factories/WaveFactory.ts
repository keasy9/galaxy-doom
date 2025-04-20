import {Scene} from "phaser";
import {Enemy} from "../../objects/game/Enemy.ts";
import {EnemyMovementSystem, TMovementParams} from "../systems/EnemyMovementSystem.ts";
import {EnemyWave} from "../../objects/game/EnemyWave.ts";
import {EnemyFormationSystem, FormationPattern, TWavePosition} from "../systems/EnemyFormationSystem.ts";
import {SceneWithCollisions} from "../../scenes/Level.ts";
import {P_SPRITES} from "../../scenes/Boot.ts";

export enum EnemyType {
    fighter = 'fighter',
}

enum WaveType {
    formation = 'formation',
    sequence = 'sequence',
}

interface WaveData {
    type: WaveType;
    enemyType: EnemyType;
    count: number;
    position: TWavePosition;
    movement: TMovementParams;
    delay?: number,
}

interface FormationWave extends WaveData {
    type: WaveType.formation;
    spacing: number;
    formation: FormationPattern;
}

interface SequenceWave extends WaveData {
    type: WaveType.sequence;
    sequenceDelay: number;
}

export type TWaveData = FormationWave | SequenceWave;

export class WaveFactory {
    static create(scene: Scene, data: TWaveData): EnemyWave {
        // 1) инициализируем волну и сразу её отключаем
        const wave = new EnemyWave(scene);
        wave.setMovementParams(data.movement)
            .setActive(false)
            .setVisible(false);

        // 2) определяем тип врага
        let enemyType: typeof Enemy;
        switch (data.enemyType) {
            case EnemyType.fighter:
                enemyType = Enemy;
                break;
        }

        // 3) создаём врагов и добавляем их к волне
        for (let i = 0; i < data.count; i++) {
            const enemy: Enemy = new enemyType(scene as SceneWithCollisions, 0, 0, 'fighter-enemy-sprite');
            enemy.play('fighter-enemy-anim');
            enemy.setVisible(true);
            enemy.addToDisplayList();

            EnemyMovementSystem.applyRotate(enemy, data.movement);
            EnemyMovementSystem.precomputeMovementParams(data.movement, wave.precomputedMovement);

            wave.add(enemy);
        }

        // 4) формируем волну
        switch (data.type) {
            case WaveType.sequence:
                EnemyFormationSystem.waveToSequence(wave, data.position, data.sequenceDelay);
                break;
            case WaveType.formation:
                EnemyFormationSystem.waveToFormation(wave, data.position, data.formation, data.spacing);
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
    static loadAssetsForEnemy(scene: Scene, type: EnemyType, loader: Phaser.Loader.LoaderPlugin) {
        switch (type) {
            case EnemyType.fighter:
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