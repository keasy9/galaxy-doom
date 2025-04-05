import { Entity, TPhysicsObject } from "./Entity.ts";
import {Scene} from "../scenes/Scene.ts";

const BULLET_WIDTH = 2;
const BULLET_HEIGHT = 6;
const BULLET_SPEED = 500;

export class Bullet extends Entity {
    protected object: TPhysicsObject;

    constructor(scene: Scene, protected x: number, protected y: number) {
        super(scene);
    }

    create() {
        const { physics, add } = this.scene;

        this.object = add.rectangle(
            this.x,
            this.y,
            BULLET_WIDTH,
            BULLET_HEIGHT,
        ) as TPhysicsObject;
        physics.add.existing(this.object, false);

        this.object.body.setVelocityY(-BULLET_SPEED);
    }

    update() {
        const { physics } = this.scene;

        if (
            this.object.body.position.x < physics.world.bounds.x
            || this.object.body.position.x > physics.world.bounds.width
            || this.object.body.position.y < physics.world.bounds.y
            || this.object.body.position.y > physics.world.bounds.height
        ) {
            this.destroy()
        }
    }

    destroy() {
        super.destroy();
        this.object.destroy();
    }
}
