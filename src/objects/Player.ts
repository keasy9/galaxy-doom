import {Bullet} from "./Bullet.ts";
import {Level, SceneWithCollisions} from "../scenes/Level.ts";
import {P_SPRITES} from "../const.ts";
import {CollisionGroup} from "../utils/managers/CollisionManager.ts";
import {Explosion} from "./Explosion.ts";
import {Pool, PoolManager} from "../utils/managers/PoolManager.ts";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;

const P_SPACESHIP = 'spaceship-white.png';
const P_PORTHOLE = 'porthole-blue.png';
const P_EXHAUST = 'exhaust-variants.png';

export class Player extends Phaser.GameObjects.Container {
    protected spaceshipSprite: Phaser.GameObjects.Sprite;
    protected portholeSprite: Phaser.GameObjects.Sprite;
    protected exhaustSprite: Phaser.GameObjects.Sprite;

    protected exhaustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    protected inputs?: Phaser.Types.Input.Keyboard.CursorKeys & { fire: Phaser.Input.Keyboard.Key };

    protected speed = 200;

    protected isFiring = false;
    protected fireInterval = 100;
    protected firingTimer: Phaser.Time.TimerEvent;

    public readonly damage = 1000;
    protected health = 100;

    constructor(scene: SceneWithCollisions, x: number, y: number) {
        super(scene, x, y, []);

        const {physics, input, make, add, time} = scene;

        this.portholeSprite = make.sprite({key: P_PORTHOLE});
        this.spaceshipSprite = make.sprite({key: P_SPACESHIP});
        this.exhaustSprite = make.sprite({key: P_EXHAUST});

        this.height = this.spaceshipSprite.height;
        this.width = this.spaceshipSprite.width;

        this.exhaustEmitter = add.particles(0, this.height / 2, P_EXHAUST, {
            frame: Phaser.Math.Between(0, 2),
            lifespan: {min: 200, max: 300},
            angle: {min: 80, max: 100},
            speed: 40,
            frequency: 15,
            x: [-4, -5, 4, 5],
            alpha: {start: 1, end: 0}
        });

        this.add([this.portholeSprite, this.spaceshipSprite, this.exhaustEmitter]);

        if (input.keyboard) {
            this.inputs = {
                ...input.keyboard.createCursorKeys(),
                fire: input.keyboard.addKey('space'),
            };
        }

        physics.add.existing(this, false);
        scene.collisions.add(this as GameObjectWithBody, CollisionGroup.player);

        (this.body as Phaser.Physics.Arcade.Body)
            .setCircle(this.spaceshipSprite.width / 2)
            .setCollideWorldBounds(true);

        this.spaceshipSprite.setTint(new Phaser.Display.Color().random(50).color);
        this.portholeSprite.preFX?.addColorMatrix()?.hue(Phaser.Math.RND.pick([0, 100, 200]));

        // инициализация позже, см this.startFire()
        this.firingTimer = time.addEvent({paused: true});
    }

    static preload(scene: Level) {
        const {load} = scene;

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

    update() {
        this.spaceshipSprite.setFrame(0);
        this.portholeSprite.setFrame(0);

        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(0);

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

                if (this.inputs.fire.isDown && !this.isFiring) this.startFire()
            }
        }
    }

    protected startFire() {
        this.isFiring = true;
        this.firingTimer.reset({
            delay: this.fireInterval,
            callback: this.fire,
            callbackScope: this,
            loop: true,
            paused: false,
        });
    }

    fire() {
        if (!this.inputs?.fire?.isDown) {
            this.isFiring = false;
            this.firingTimer.paused = true;
            return;
        }

        PoolManager.get(Pool.bullets, this.x - 11, this.y)
        PoolManager.get(Pool.bullets, this.x + 11, this.y)
    }

    takeDamage(damage: number): boolean {
        this.health -= damage;
        if (this.health <= 0) {
            this.destroy();
            //todo gameover
        }

        return true;
    }

    destroy(fromScene?: boolean) {
        this.scene.add.existing(new Explosion(this.scene, this.x, this.y, 2));
        super.destroy(fromScene);
    }
}