import {Scene} from "phaser";
import {Progressbar} from "../../objects/gui/Progressbar.ts";
import BitmapText = Phaser.GameObjects.BitmapText;
import {Menu} from "../../objects/gui/Menu.ts";
import {Button} from "../../objects/gui/Button.ts";
import {GuiManager} from "../managers/GuiManager.ts";

export enum Font {
    main = 'font_press_start_2p'
}

export enum FontSize {
    default = 8,
    medium = 16,
}

export enum GuiColor {
    blue = 0x2692f0,
    grayBlue = 0x91bccf,
    white = 0xffffff,
}

export class GuiFactory {
    protected static scene: Scene;

    public static init(scene: Scene) {
        this.scene = scene;
    }

    public static progressbar({x, y, color, bgColor, height = 25, width, progress = 0}: {
        x: number,
        y: number,
        color: number,
        bgColor?: number,
        height?: number,
        width?: number,
        progress?: number,
    }): Progressbar {
        width ??= this.scene.cameras.main.width * .7;

        return new Progressbar(this.scene, x, y, height, width, color, progress, bgColor);
    }

    public static text({x = 0, y = 0, text = '', fontSize = FontSize.default, font = Font.main, origin = 0.5}: {
        x?: number,
        y?: number,
        text?: string,
        fontSize?: FontSize,
        font?: Font,
        origin?: number,
    } = {}): BitmapText {
        return this.scene.add.bitmapText(
            x,
            y,
            font,
            text,
            fontSize,
        ).setOrigin(origin);
    }

    public static menu({x, y, width}: {
        x: number,
        y: number,
        width: number,
    }): Menu {
        return new Menu(this.scene, x, y, width);
    }

    public static button({x = 0, y = 0, text, onclick, color, height = 0, width = 0}: {
        x?: number,
        y?: number,
        text: string | BitmapText | { text: string, font?: Font, fontSize?: FontSize },
        onclick: Function,
        color: GuiColor,
        height?: number
        width?: number
    }): Button {
        let bitmapText: BitmapText;
        if (text instanceof BitmapText) {
            bitmapText = text;

        } else if (typeof text == 'string') {
            bitmapText = this.text({text});

        } else if (typeof text == 'object') {
            bitmapText = this.text(text);
        }

        const button = new Button(this.scene, x, y, width, height, color, bitmapText!, onclick);
        GuiManager.addFocusable(button);

        return button;
    }
}
