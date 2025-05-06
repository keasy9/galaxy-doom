import {Scene} from "phaser";
import Graphics = Phaser.GameObjects.Graphics;
import {GuiColor} from "../../utils/factories/GuiFactory.ts";
import {GuiElement} from "./GuiElement.ts";

/*
 * меню - контейнер для других элементов
 */
export class Menu extends GuiElement {
    protected borders: Graphics[] = [];

    constructor(scene: Scene, x: number, y: number, public width: number) {
        super(scene, x, y);
        scene.add.existing(this);
    }

    public clear(): this {
        this.removeAll(true);

        return this;
    }

    public with(...elems: GuiElement[]): this {
        this.add(elems);

        return this;
    }

    /**
     * выравнивает элементы в колонку. Автоматически сдвигает всё меню вверх на половину итоговой высоты
     *
     * @param elemsHeight
     * @param spacing
     * @param padding
     */
    public render({elemHeight = 25, spacing = 0, padding = 0}: {
        elemHeight?: number,
        spacing?: number,
        padding?: number,
    } = {}): this {
        let i = 0;
        this.each((elem: GuiElement) => {
            elem.x += padding;
            elem.setSize(this.width - padding * 2, elemHeight);
            elem.y = (elemHeight + spacing) * i;
            i++;
        });

        const elemsHeight = (this.list.length * elemHeight + (this.list.length - 1) * spacing);
        this.y = this.y - elemsHeight / 2;

        this.borders = [
            this.scene.add
                .graphics()
                .fillStyle(GuiColor.white)
                .fillRect(-10, -6, this.width + 10, 3),

            this.scene.add
                .graphics()
                .fillStyle(GuiColor.white)
                .fillRect(-10, elemsHeight + 3, this.width + 10, 3),
        ];

        this.add(this.borders);

        return this;
    }
}