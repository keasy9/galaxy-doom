import {Scene} from "phaser";
import {WaveManager} from "./WaveManager.ts";
import {WaveFactory, EEnemyType, TWaveData} from "../factories/WaveFactory.ts";
import {P_LEVELS} from "../../scenes/Boot.ts";

type TLevelData = {
    number: number,
    timeline: TTimelineEvent[];
}

enum ETimelineEvent {
    Wave = 'wave',
    Dialog = 'dialog',
}

interface BaseTimelineEvent {
    type: ETimelineEvent,
    data: TWaveData | TMonologData[],
}

interface WaveTimelineEvent extends BaseTimelineEvent {
    type: ETimelineEvent.Wave,
    data: TWaveData,
}

interface DialogTimelineEvent extends BaseTimelineEvent {
    type: ETimelineEvent.Dialog,
    data: TMonologData[],
}

type TTimelineEvent = WaveTimelineEvent | DialogTimelineEvent;

type TMonologData = {
    // todo
}

export class LevelManager {
    protected levelData: TLevelData;
    protected controller?: WaveManager;

    constructor(protected scene: Scene) {}

    load(levelNumber: number) {
        const levelLoader = new Phaser.Loader.LoaderPlugin(this.scene);
        const jsonDataKey = `level_${levelNumber}`;

        levelLoader.once(Phaser.Loader.Events.COMPLETE, () => {
            this.levelData = this.scene.cache.json.get(jsonDataKey);

            const enemyLoader = new Phaser.Loader.LoaderPlugin(this.scene);

            const loadedTypes: EEnemyType[] = [];
            for (const event of this.levelData.timeline) {
                if (event.type !== ETimelineEvent.Wave) continue;

                if (loadedTypes.indexOf(event.data.enemyType) === -1) {
                    WaveFactory.loadAssetsForEnemy(this.scene, event.data.enemyType, enemyLoader);
                    loadedTypes.push(event.data.enemyType);
                }
            }

            enemyLoader.start();

            enemyLoader.on(Phaser.Loader.Events.COMPLETE, () => this.startLevel());
        });

        levelLoader.json(jsonDataKey, P_LEVELS + `${levelNumber}.json`);

        levelLoader.start();
    }

    startLevel() {
        const waves: TWaveData[] = [];

        this.levelData.timeline.forEach((event) => {
            if (event.type === ETimelineEvent.Wave) waves.push(event.data);
        })

        // todo диалоги
        this.controller = new WaveManager(this.scene, waves);
    }
}