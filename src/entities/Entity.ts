import {Scene} from "../scenes/Scene.ts";

export type TPhysicsObject = Phaser.GameObjects.GameObject & { body: Phaser.Physics.Arcade.Body};


export abstract class Entity {
    protected active = true;

    constructor(protected scene: Scene) { }

    init() {}

    preload() {}

    create() {}

    // @ts-ignore
    update(time: number, delta: number) {}

    destroy() {
        this.active = false;
    }

    isActive() {
        return this.active;
    }
}