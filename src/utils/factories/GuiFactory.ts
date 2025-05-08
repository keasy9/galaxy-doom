import {Scene} from "phaser";
import {Progressbar} from "../../objects/gui/Progressbar.ts";
import BitmapText = Phaser.GameObjects.BitmapText;
import {Menu} from "../../objects/gui/Menu.ts";
import {Button} from "../../objects/gui/Button.ts";

// Растровые шрифты
export enum Font {
    Main = 'font_press_start_2p',
}

// Стандартизированные размеры шрифта
export enum FontSize {
    Default = 8,
    Medium = 16,
}

// Стандартизированные цвета для элементов интерфейса
export enum GuiColor {
    Blue = 0x2692f0,
    GrayBlue = 0x91bccf,
    White = 0xffffff,
}

// Фабрика элементов интерфейса
export class GuiFactory {
    constructor(protected scene: Scene) {}

    /**
     * Создать полосу прогресса
     *
     * @param x позиция по x
     * @param y позиция по y
     * @param color цвет полосы
     * @param bgColor цвет фона. Если не задан, фон будет прозрачным
     * @param height высота полосы
     * @param width ширина полосы
     * @param progress прогресс от 0 до 1. Автоматически выводится текстом в процентах
     */
    public progressbar({x, y, color, bgColor, height = 25, width, progress = 0}: {
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

    /**
     * Создать текст
     *
     * @param x позиция по x
     * @param y позиция по y
     * @param text текст (строка)
     * @param fontSize размер шрифта
     * @param font шрифт
     * @param origin точка выравнивания
     */
    public text({x = 0, y = 0, text = '', fontSize = FontSize.Default, font = Font.Main, origin = 0.5}: {
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

    /**
     * Создать меню - автоматически располагает элементы в колонку
     *
     * @param x позиция по x
     * @param y позиция по y
     * @param width ширина меню
     */
    public menu({x, y, width}: {
        x: number,
        y: number,
        width: number,
    }): Menu {
        return new Menu(this.scene, x, y, width);
    }

    /**
     * Создать кнопку
     *
     * @param x позиция по x
     * @param y позиция по y
     * @param text текст кнопки
     * @param onclick реакция на клик по кнопке
     * @param color цвет кнопки
     * @param height высота кнопки
     * @param width ширина кнопки
     */
    public button({x = 0, y = 0, text, onclick, color, height = 0, width = 0}: {
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

        return new Button(this.scene, x, y, width, height, color, bitmapText!, onclick);
    }
}
