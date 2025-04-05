import {Entity, TPhysicsObject} from "./Entity.ts";
import {Bullet} from "./Bullet.ts";

const PLAYER_SIZE = 20;
const PLAYER_VELOCITY = 300;

export class Player extends Entity {
    protected object: TPhysicsObject;
    protected inputs?: Phaser.Types.Input.Keyboard.CursorKeys & { fire?: Phaser.Input.Keyboard.Key};
    protected firedOdd = true;

    create() {
        const { physics, add, cameras, input, time } = this.scene;

        this.object = add.rectangle(
            cameras.main.width / 2,
            cameras.main.height - PLAYER_SIZE,
            PLAYER_SIZE,
            PLAYER_SIZE,
        ) as TPhysicsObject;

        physics.add.existing(this.object, false);

        if (input.keyboard) {
            this.inputs = input.keyboard.createCursorKeys();
            this.inputs.fire = input.keyboard.addKey('space');
        }

        this.object.body.setCollideWorldBounds(true);

        time.addEvent({
            delay: 70, // ms
            callback: this.fire,
            callbackScope: this,
            loop: true,
        });
    }

    update() {
        this.object.body.setVelocity(0);

        if (this.inputs) {
            if (this.inputs.left.isDown) this.object.body.setVelocityX(-PLAYER_VELOCITY);
            else if (this.inputs.right.isDown) this.object.body.setVelocityX(PLAYER_VELOCITY);

            if (this.inputs.up.isDown) this.object.body.setVelocityY(-PLAYER_VELOCITY);
            else if (this.inputs.down.isDown) this.object.body.setVelocityY(PLAYER_VELOCITY);

        }
    }

    fire() {
        if (this.inputs && this.inputs.fire?.isDown) {
            this.scene.addEntityToGroup(new Bullet(
                this.scene,
                this.object.body.x + (this.firedOdd ? 2 : PLAYER_SIZE - 2),
                this.object.body.y + 2,
            ), 'bullets');

            this.firedOdd = !this.firedOdd;
        }
    }
}