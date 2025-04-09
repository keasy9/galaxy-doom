import { Scene } from "phaser";
import { Background } from "../objects/Background.ts";
import { Player } from "../objects/Player.ts";
import {Bullet} from "../objects/Bullet.ts";

export class Level extends Scene {
    protected readonly name: string = 'level';

    protected bg: Background;
    protected player: Player;

    constructor(key: string = 'name') {
        super(key);
    }

    preload() {
        Background.preload(this);
        Player.preload(this);
        Bullet.preload(this);
    }

    create() {
        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
            if (
                'onWorldBounds' in  body.gameObject
                && typeof body.gameObject.onWorldBounds === 'function'
            ) body.gameObject?.onWorldBounds();
        });

        this.bg = this.add.existing(new Background(this))
        this.bg.create();

        this.player = this.add.existing(new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 30))
        this.player.create();
    }

    update() {
        this.player.update()
    }
}
