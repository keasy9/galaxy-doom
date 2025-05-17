import {Scene} from "phaser";
import {TWaveData, WaveFactory} from "../factories/WaveFactory.ts";
import {EVENT_WAVE_COMPLETE} from "../../const.ts";
import {EnemyWave} from "../../objects/game/EnemyWave.ts";

/**
 * Менеджер волн
 *
 * Запускает волны
 */
export class WaveManager {
    /**
     * Текущая волна
     * @protected
     */
    protected currentWave: EnemyWave;

    /**
     * Номер текущей волны
     * @protected
     */
    protected currentWaveNumber: number;

    constructor(protected scene: Scene, protected waveData: TWaveData[]) {
        this.scene.events.on(EVENT_WAVE_COMPLETE, (waveIndex: number) => {
            if (waveIndex === this.currentWaveNumber) this.startWave(++this.currentWaveNumber);
        });

        this.startWave(0);
    }

    /**
     * Начать волну
     * @param waveNumber
     */
    startWave(waveNumber: number) {
        // todo четвёртая волна почему-то не стартует
        if (waveNumber >= this.waveData.length) return;

        this.currentWaveNumber = waveNumber;
        const waveData = this.waveData[this.currentWaveNumber];
        this.currentWave = WaveFactory.create(this.scene, waveData)

        if (waveData.nextWaveIn && waveData.nextWaveIn > 0) {
            this.scene.time.addEvent({
                delay: waveData.nextWaveIn,
                callback: () => {
                    if (waveNumber === this.currentWaveNumber) this.startWave(++this.currentWaveNumber)
                },
            });
        }
    }
}