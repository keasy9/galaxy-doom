import {Scene} from "phaser";

export enum Lang {
    ru = 'ru',
    en = 'en',
}

export class Translator {
    protected static scene: Scene;

    public static readonly fallback: Lang = Lang.en;
    protected static currentLang: Lang;

    public static init(scene: Scene) {
        this.scene = scene;
    }

    public static get current(): Lang {
        if (this.currentLang === undefined) {
            const userLang: Lang = navigator.language as Lang;
            this.currentLang = userLang in Lang ? userLang : this.fallback;
        }

        return this.currentLang;
    }

    public static get(text: string, lang: Lang = this.current, useFallback: boolean = true) {
        const current = this.scene.cache.json.get('lang-' + lang);
        if (current[text]) return current[text];

        if (!useFallback) return text;

        return this.scene.cache.json.get('lang-' + this.fallback)[text] ?? text;
    }
}