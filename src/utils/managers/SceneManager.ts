import {SoundManager} from "./SoundManager.ts";
import {Scene} from "phaser";
import {PoolManager} from "./PoolManager.ts";
import {Translator} from "./Translator.ts";
import {CollisionManager} from "./CollisionManager.ts";

export enum SceneEnum {
    Boot = 'boot',
    Home = 'home',
    Level = 'level',
    Pause = 'pause',
}

export class SceneManager {
    protected static scene: Scene;

    public static init(scene: Scene): typeof SceneManager {
        this.scene = scene;

        return this;
    }

    public static getScene(): Scene {
        return this.scene;
    }

    /**
     * Плавный переход с затуханием к другой сцене. Если параметр inDuration не передан, то параметр outDuration будет
     * означать общую длительность перехода.
     *
     * @param scene
     * @param outDuration
     * @param inDuration
     */
    public static fadeTo(scene: SceneEnum, outDuration: number = 200, inDuration?: number): typeof SceneManager {
        if (inDuration == undefined) inDuration = outDuration = outDuration / 2;

        // Сохраняем ссылку на текущую сцену
        const currentScene = this.scene;

        // Останавливаем все звуки с плавным затуханием. На всякий случай звук убираем быстрее, чем камеру
        SoundManager.fadeOut(outDuration - 100);

        // Запускаем fadeOut и сразу подписываемся на событие завершения
        this.scene.cameras.main.once('camerafadeoutcomplete', () => {
            this.clearResourcesOnSceneChange();
            currentScene.scene.start(scene);

            this.initManagersOnSceneChange(this.scene.scene.get(scene));

            this.scene.cameras.main.fadeIn(inDuration);
            SoundManager.fadeIn(inDuration);
        });

        this.scene.cameras.main.fadeOut(outDuration);

        return this;
    }

    /**
     * Сообщает менеджерам, что сцена сменилась
     * @protected
     */
    protected static initManagersOnSceneChange(scene: Scene): typeof SceneManager {
        // точно есть во всех сценах
        this.init(scene);
        SoundManager.init(scene);
        Translator.init(scene);

        // специфичны для сцен. Потенциальная оптимизация
        PoolManager.init(scene);
        CollisionManager.init(scene);

        return this;
    }

    /**
     * Освобождает ресурсы при смене сцен.
     * @protected
     */
    protected static clearResourcesOnSceneChange(): typeof SceneManager {
        PoolManager.clear();
        CollisionManager.clear();

        return this;
    }
}