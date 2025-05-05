import Container = Phaser.GameObjects.Container;
import {Scene} from "phaser";

export class Menu extends Container {

    constructor(scene: Scene, x: number, y: number, public width: number) {
        super(scene, x, y);
        scene.add.existing(this);
    }

    public clear(): this {
        this.removeAll(true);

        return this;
    }

    public with(...elems: Container[]): this {
        this.add(elems);

        return this;
    }

    public align({elemsHeight = 25, spacing = 0, padding = 0}: {
        elemsHeight?: number,
        spacing?: number,
        padding?: number,
    } = {}): this {
        let i = 0;
        this.each((elem: Container) => {
            elem.x += padding;
            elem.setSize(this.width - padding * 2, elemsHeight);
            elem.y = (elemsHeight + spacing) * i;
            i++;
        });

        return this;
    }
}