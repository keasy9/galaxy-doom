import {SoundManager} from "./SoundManager.ts";
import {Scene} from "phaser";
import {GuiManager} from "./GuiManager.ts";
import {GuiFactory} from "../factories/GuiFactory.ts";
import {PoolManager} from "./PoolManager.ts";
import {Translator} from "./Translator.ts";

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
    public static fadeTo(scene: string | Scene, outDuration: number = 200, inDuration?: number): typeof SceneManager {
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
        this.init(scene);
        SoundManager.init(scene);
        GuiManager.init(scene);
        GuiFactory.init(scene);
        PoolManager.init(scene);
        Translator.init(scene);
        // todo добавить остальных когда будут реализованы

        return this;
    }

    /**
     * Освобождает ресурсы при смене сцен.
     * @protected
     */
    protected static clearResourcesOnSceneChange(): typeof SceneManager {
        // todo

        return this;
    }
}