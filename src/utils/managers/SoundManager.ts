import {Scene} from "phaser";
import SoundConfig = Phaser.Types.Sound.SoundConfig;
import WebAudioSound = Phaser.Sound.WebAudioSound;
import HTML5AudioSound = Phaser.Sound.HTML5AudioSound;
import NoAudioSound = Phaser.Sound.NoAudioSound;

export enum Sound {
    // интро
    sfx_intro_coin = 'sfx_intro_coin',
    sfx_intro_power = 'sfx_intro_power',
    sfx_intro_rainbow = 'sfx_intro_rainbow',

    // гуи
    sfx_short_glitch = 'sfx_short_glitch',

    // тема меню
    loop_menu_theme = 'loop_menu_theme',
}

export type SoundInstance = WebAudioSound | HTML5AudioSound | NoAudioSound;

export class SoundManager {
    protected static scene: Scene;

    public static init(scene: Scene): typeof SoundManager {
        this.scene = scene;

        return this;
    }

    /**
     * Получить звук
     * @param key
     * @param once
     * @param config
     */
    public static get(key: Sound, once: boolean = true, config: SoundConfig = {}): SoundInstance {
        return (once ? this.scene.sound.get(key) : null) ?? this.scene.sound.add(key, config);
    }

    /**
     * Получить звук и сразу же проиграть его
     * @param key
     * @param once
     * @param config
     */
    public static play(key: Sound, once: boolean = true, config: SoundConfig = {}): SoundInstance {
        const sound = this.get(key, once, config);
        if (!sound.isPlaying) sound.play();

        return sound;
    }

    /**
     * Затухание всех звуков
     * @param duration
     */
    public static fadeOut(duration: number): void {
        // запоминаем оригинальную громкость
        const volume = this.scene.sound.volume;

        this.scene.tweens.add({
            targets: this.scene.sound,
            volume: 0,
            duration: duration,
            onComplete: () => {
                this.stopAll();
                this.scene.sound.setVolume(volume);
            },
        });
    }

    /**
     * Появление всех звуков
     * @param duration
     * @param toVolume
     */
    public static fadeIn(duration: number, toVolume?: number): void {
        // запоминаем оригинальную громкость
        toVolume ??= this.scene.sound.volume;

        this.scene.sound.setVolume(0);
        this.scene.tweens.add({
            targets: this.scene.sound,
            volume: toVolume,
            duration: duration,
        });
    }

    /**
     * Резкая остановка всех звуков
     */
    public static stopAll(): void {
        this.scene.sound.stopAll();
    }
}