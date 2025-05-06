import {SoundManager} from "./SoundManager.ts";
import {Scene} from "phaser";

export class SceneManager {
    protected static scene: Scene;

    public static init(scene: Scene): typeof SceneManager {
        this.scene = scene;

        return this;
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

        // Останавливаем все звуки с плавным затуханием
        SoundManager.fadeOut(outDuration);

        // Запускаем fadeOut и сразу подписываемся на событие завершения
        this.scene.cameras.main.once('camerafadeoutcomplete', () => {
            this.clearResourcesOnSceneChange();
            currentScene.scene.start(scene);
            this.scene.scene.get(scene).cameras.main.fadeIn(inDuration);
        });

        this.scene.cameras.main.fadeOut(outDuration);

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