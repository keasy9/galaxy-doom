import { Scene } from "phaser";
import { Bullet } from "./Bullet.ts";

const PLAYER = 'player.png';
const PLAYER_CANNON = 'player_cannon.png';

const FIRE_ANIM_FIRE = 'fire_fire';
const FIRE_ANIM_END  = 'fire_end';

const PLAYER_VELOCITY = 300;

export class Player extends Phaser.GameObjects.Container {
    protected cannonSprite: Phaser.GameObjects.Sprite;
    protected playerSprite: Phaser.GameObjects.Sprite;

    protected fireDuration: number;
    protected isFiring = false;

    protected inputs?: Phaser.Types.Input.Keyboard.CursorKeys & { fire?: Phaser.Input.Keyboard.Key};

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y - 20, []);
    }

    static preload(scene: Scene) {
        const { load } = scene;

        load.image(PLAYER, ASSETS_DIR + PLAYER);
        load.spritesheet(
            PLAYER_CANNON,
            ASSETS_DIR + PLAYER_CANNON,
            {
                frameWidth: 30,
                frameHeight: 27,
            },
        );
    }

    create() {
        const { physics, input, make, anims } = this.scene;

        anims.create({
            key: FIRE_ANIM_FIRE,
            frames: anims.generateFrameNumbers(PLAYER_CANNON, { frames: [1, 2, 3, 4] }),
            frameRate: 10,
        });

        anims.create({
            key: FIRE_ANIM_END,
            frames: anims.generateFrameNumbers(PLAYER_CANNON, { frames: [5, 6, 0] }),
            frameRate: 10,
        });

        this.fireDuration = anims.get(FIRE_ANIM_FIRE).duration;

        this.cannonSprite = make.sprite({key: PLAYER_CANNON, y: -4});
        this.playerSprite = make.sprite({key: PLAYER});
        this.add([this.cannonSprite, this.playerSprite]);

        this.height = this.playerSprite.height;
        this.width = this.playerSprite.width;

        physics.add.existing(this, false);

        if (input.keyboard) {
            this.inputs = input.keyboard.createCursorKeys();
            this.inputs.fire = input.keyboard.addKey('space');
        }

        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    }

    update() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);

        if (this.inputs) {
            if (this.inputs.left.isDown) body.setVelocityX(-PLAYER_VELOCITY);
            else if (this.inputs.right.isDown) body.setVelocityX(PLAYER_VELOCITY);

            if (this.inputs.up.isDown) body.setVelocityY(-PLAYER_VELOCITY);
            else if (this.inputs.down.isDown) body.setVelocityY(PLAYER_VELOCITY);

            if (this.inputs.fire?.isDown && !this.isFiring) this.fire();
        }
    }

    fire() {
        if (this.inputs?.fire?.isDown) {
            this.isFiring = true;

            this.cannonSprite.anims.playAfterRepeat(FIRE_ANIM_FIRE, 0);

            const leftBullet = new Bullet(this.scene, this.x - 10, this.y)
            leftBullet.create();
            this.scene.add.existing(leftBullet);

            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    const rightBullet = new Bullet(this.scene, this.x + 10, this.y)
                    rightBullet.create();
                    this.scene.add.existing(rightBullet);
                },
                loop: false,
            });

            this.scene.time.addEvent({
                delay: this.fireDuration,
                callback: this.fire,
                callbackScope: this,
                loop: false,
            });

        } else if (this.isFiring) {
            this.isFiring = false;
            this.cannonSprite.anims.playAfterRepeat(FIRE_ANIM_END, 0);
        }
    }
}