import { Scene } from "phaser";
import { P_LEVELS } from "../../const.ts";
import { TWaveData, WaveController } from "./WaveController.ts";
import {WaveFactory, EnemyType} from "../../objects/enemy/WaveFactory.ts";

export type LevelData = {
    waves: TWaveData[];
};

export class LevelManager {
    protected levelData: LevelData;
    protected controller?: WaveController;

    constructor(protected scene: Scene, protected currentLevel: number = 1) { }

    loadLevel(startAfterLoad: boolean = false) {
        const levelLoader = new Phaser.Loader.LoaderPlugin(this.scene);
        const levelName = this.currentLevel.toString().padStart(3, '0');
        levelLoader.json(levelName, P_LEVELS + `${levelName}.json`);
        levelLoader.once(Phaser.Loader.Events.COMPLETE, () => {
            this.levelData = this.scene.cache.json.get(levelName);

            const enemyLoader = new Phaser.Loader.LoaderPlugin(this.scene);

            const loadedTypes: EnemyType[] = [];
            for (const wave of this.levelData.waves) {
                if (loadedTypes.indexOf(wave.enemyType) === -1) {
                    WaveFactory.loadAssetsForEnemy(this.scene, wave.enemyType, enemyLoader);
                    loadedTypes.push(wave.enemyType);
                }
            }

            enemyLoader.start();

            enemyLoader.on(Phaser.Loader.Events.COMPLETE, () => {
                if (startAfterLoad) this.startLevel()
            });
        });

        levelLoader.start();
    }

    startLevel() {
        this.controller = new WaveController(this.scene, this.levelData.waves);
    }
}