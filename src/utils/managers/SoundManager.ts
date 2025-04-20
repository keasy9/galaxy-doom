import {Scene} from "phaser";

export enum Sound {
    // звуки интро
    sfx_intro_coin = 'sfx_intro_coin',
    sfx_intro_power = 'sfx_intro_power',
    sfx_intro_rainbow = 'sfx_intro_rainbow',
}

export type SoundObject = {
    play: () => boolean,
    stop: () => number,
}

export class SoundManager {
    protected static scene: Scene;

    public static init(scene: Scene) {
        this.scene = scene;
    }

    public static get(key: Sound): SoundObject {
        return {
            play: () => this.scene.sound.play(key),
            stop: () => this.scene.sound.stopByKey(key),
        }
    }

    public static play(key: Sound): SoundObject {
        const sound = this.get(key);
        sound.play();

        return sound;
    }

    public static stopAll(fade?: number): void {
        if (fade) {
            this.scene.tweens.add({
                targets: this.scene.sound,
                volume: 0,
                duration: fade,
                onComplete: () => this.scene.sound.stopAll(),
            });
        } else {
            this.scene.sound.stopAll();
        }
    }

    public static setRate(rate: number): void {
        this.scene.sound.setRate(rate);
    }
}