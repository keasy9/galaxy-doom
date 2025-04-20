import {Scene} from "phaser";
import {Background} from "../objects/game/Background.ts";
import {Player} from "../objects/game/Player.ts";
import {Bullet} from "../objects/game/Bullet.ts";
import {LevelManager} from "../utils/managers/LevelManager.ts";
import {CollisionManager} from "../utils/managers/CollisionManager.ts";
import {Explosion} from "../objects/game/Explosion.ts";
import {PoolManager} from "../utils/managers/PoolManager.ts";

export type SceneWithCollisions = Scene & {
    collisions: CollisionManager;
}

export class Level extends Scene {
    protected bg: Background;
    protected player: Player;
    protected levelManager: LevelManager;
    public readonly collisions: CollisionManager;

    constructor(key: string = 'level') {
        super(key);
        this.levelManager = new LevelManager(this);
        PoolManager.init(this);
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
