import {Scene} from "phaser";
import {TMovementParams} from "../../objects/enemy/EnemyMovementSystem.ts";
import {WaveFactory, EnemyType} from "../../objects/enemy/WaveFactory.ts";
import {EVENT_WAVE_COMPLETE} from "../../const.ts";
import {EnemyWave} from "../../objects/enemy/EnemyWave.ts";

enum FormationPattern {
    grid = 'grid',
    circle = 'circle',
    vShape = 'v-shape',
}

enum ScreenPositionPreset {
    topCenter = 'topCenter',
    bottomLeft = 'bottomLeft',
    bottomRight = 'bottomRight',
}

enum WaveType {
    formation = 'formation',
    sequence = 'sequence',
}

export type TPoint = { x: number, y: number, }
type TWavePosition = TPoint | ScreenPositionPreset;

interface WaveData {
    /**
     * Тип волны (formation - одновременное появление, sequence - последовательное)
     */
    type: WaveType;

    /**
     * Тип врага (должен соответствовать ключам в фабрике врагов)
     */
    enemyType: EnemyType;

    /**
     * Количество врагов в волне
     */
    count: number;

    /**
     * Позиция спавна (координаты или ключевые позиции экрана)
     */
    position: TWavePosition;

    /**
     * Параметры движения
     */
    movement: TMovementParams;

    /**
     * Модификаторы сложности
     */
    modifiers?: {
        healthMultiplier?: number;
        speedMultiplier?: number;
        damageMultiplier?: number;
    };

    /**
     * Задержка перед следующей волной
     */
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

export class WaveController {
    protected currentWave: EnemyWave;
    protected currentWaveNumber: number;

    constructor(protected scene: Scene, protected waveData: TWaveData[]) {
        this.scene.events.on(EVENT_WAVE_COMPLETE, (waveIndex: number) => {
            if (waveIndex === this.currentWaveNumber) this.startWave(++this.currentWaveNumber);
        });

        this.startWave(0);
    }

    startWave(waveNumber: number) {
        if (waveNumber >= this.waveData.length) return;

        this.currentWaveNumber = waveNumber;
        const waveData = this.waveData[this.currentWaveNumber];
        this.currentWave = WaveFactory.create(this.scene, waveData)

        if (waveData.delay && waveData.delay > 0) {
            this.scene.time.addEvent({
                delay: waveData.delay,
                callback: () => {
                    if (waveNumber === this.currentWaveNumber) this.startWave(++this.currentWaveNumber)
                },
            });
        }
    }
}