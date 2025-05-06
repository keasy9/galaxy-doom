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

// todo контроль кол-ва экземпляров тут, а не в phaser
export class SoundManager {
    protected static scene: Scene;

    public static init(scene: Scene) {
        this.scene = scene;
    }

    public static get(key: Sound, once: boolean = true, config: SoundConfig = {}): SoundInstance {
        return (once ? this.scene.sound.get(key) : null) ?? this.scene.sound.add(key, config);
    }

    public static play(key: Sound, once: boolean = true, config: SoundConfig = {}): SoundInstance {
        const sound = this.get(key, once, config);
        if (!sound.isPlaying) sound.play();

        return sound;
    }

    public static stopAll(fade?: number): void {
        if (fade !== undefined) {
            const volume = this.scene.sound.volume;
            this.scene.tweens.add({
                targets: this.scene.sound,
                volume: 0,
                duration: fade,
                onComplete: () => {
                    this.scene.sound.stopAll();
                    this.scene.sound.setVolume(volume);
                },
            });
        } else {
            this.scene.sound.stopAll();
        }
    }
}