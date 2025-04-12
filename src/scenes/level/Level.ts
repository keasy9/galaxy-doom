import { Scene } from "phaser";
import { Background } from "../../objects/Background.ts";
import { Player } from "../../objects/Player.ts";
import { Bullet } from "../../objects/Bullet.ts";
import { LevelManager } from "./LevelManager.ts";
import {CollisionManager} from "./CollisionManager.ts";
import {Explosion} from "../../objects/Explosion.ts";

export type SceneWithCollisions = Scene & {
    collisions: CollisionManager;
}

export class Level extends Scene {
    protected bg: Background;
    protected player: Player;
    protected levelManager: LevelManager;
    public readonly collisions: CollisionManager;

    constructor(key: string = 'name') {
        super(key);
        this.levelManager = new LevelManager(this);
    }

    preload() {
        Background.preload(this);
        Player.preload(this);
        Bullet.preload(this);
        Explosion.preload(this);
    }

    create() {
        this.collisions = new CollisionManager(this);

        // todo bg должен определяться уровнем
        this.bg = this.add.existing(new Background(this))
        this.bg.create();

        this.player = this.add.existing(new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 30))

        this.levelManager.loadLevel(true);
    }

    update() {
        this.player.update();
    }
}
