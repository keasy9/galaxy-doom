import {Scene} from "phaser";
import {Progressbar} from "../../objects/gui/Progressbar.ts";
import BitmapText = Phaser.GameObjects.BitmapText;

export enum Font {
    main = 'font_press_start_2p'
}

export enum FontSize {
    default = 8,
    medium = 16,
}

export class GuiManager {
    protected static scene: Scene;

    public static init(scene: Scene) {
        this.scene = scene;
    }

    public static progressbar(
        x: number,
        y: number,
        color: number,
        bgColor: number|null = null,
        height: number = 25,
        width: number|null = null,
        progress: number = 0,
    ): Progressbar {
        width ??= this.scene.cameras.main.width * .7;

        return new Progressbar(this.scene, x, y, height, width, color, progress, bgColor);
    }

    public static text(
        x: number,
        y: number,
        text: string,
        fontSize: FontSize = FontSize.default,
        font: Font = Font.main,
        origin: number = 0.5,
    ): BitmapText {
        return this.scene.add.bitmapText(
            x,
            y,
            font,
            text,
            fontSize,
        ).setOrigin(origin);
    }
}