import {Scene} from "phaser";

export abstract class GuiElement {
    constructor(protected scene: Scene, protected x: number, protected y: number) { }

    public abstract destroy(): void;
}