import { Scene } from "phaser";

const P_SPACESHIP = 'spaceship-white.png';
const P_PORTHOLE = 'porthole-blue.png';
const P_EXHAUST = 'exhaust-variants.png';

export class Player extends Phaser.GameObjects.Container {
    protected spaceshipSprite: Phaser.GameObjects.Sprite;
    protected portholeSprite: Phaser.GameObjects.Sprite;
    protected exhaustSprite: Phaser.GameObjects.Sprite;

    protected exhaustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    protected inputs?: Phaser.Types.Input.Keyboard.CursorKeys;

    protected speed = 200;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, []);
    }

    static preload(scene: Scene) {
        const { load } = scene;

        const sprite32 = {
            frameWidth: 32,
            frameHeight: 32,
        };

        load.spritesheet(P_PORTHOLE, P_SPRITES + P_PORTHOLE, sprite32);
        load.spritesheet(P_SPACESHIP, P_SPRITES + P_SPACESHIP, sprite32);

        const sprite2 = {
            frameWidth: 2,
            frameHeight: 2,
        };

        load.spritesheet(P_EXHAUST, P_SPRITES + P_EXHAUST, sprite2);
    }

    create() {
        const { physics, input, make, add } = this.scene;

        this.portholeSprite = make.sprite({key: P_PORTHOLE}); // todo почему-то сдвинут вверх на 1 пиксель
        this.spaceshipSprite = make.sprite({key: P_SPACESHIP});
        this.exhaustSprite = make.sprite({key: P_EXHAUST});

        this.height = this.spaceshipSprite.height;
        this.width = this.spaceshipSprite.width;

        this.exhaustEmitter = add.particles(0, this.height / 2, P_EXHAUST, {
            frame: Phaser.Math.Between(0, 2),
            lifespan: { min: 200, max: 300 },
            angle: { min: 80, max: 100 },
            speed: 40,
            frequency: 15,
            x: [-4, 4],
            alpha: {start: 1, end: 0}
        });

        this.add([this.portholeSprite, this.spaceshipSprite, this.exhaustEmitter]);

        physics.add.existing(this, false);

        if (input.keyboard) {
            this.inputs = input.keyboard.createCursorKeys();
        }

        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.spaceshipSprite.setTint(new Phaser.Display.Color().random(50).color);
        this.portholeSprite.preFX?.addColorMatrix()?.hue(Phaser.Math.RND.pick([0, 100, 200]));
    }

    update() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);
        this.spaceshipSprite.setFrame(0);
        this.portholeSprite.setFrame(0);

        if (this.inputs) {
            if (this.inputs.left.isDown) {
                body.setVelocityX(-this.speed);
                this.spaceshipSprite.setFrame(1);
                this.portholeSprite.setFrame(1);

            } else if (this.inputs.right.isDown) {
                body.setVelocityX(this.speed);
                this.spaceshipSprite.setFrame(2);
                this.portholeSprite.setFrame(2);
            }

            if (this.inputs.up.isDown) {
                body.setVelocityY(-this.speed);
                this.exhaustEmitter.frequency = 5;

            } else if (this.inputs.down.isDown) {
                body.setVelocityY(this.speed);
                this.exhaustEmitter.frequency = 25;

            } else {
                this.exhaustEmitter.frequency = 15
            }
        }
    }
}