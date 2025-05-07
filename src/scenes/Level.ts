import {Scene} from "phaser";
import {Background} from "../objects/game/Background.ts";
import {Player} from "../objects/game/Player.ts";
import {Bullet} from "../objects/game/Bullet.ts";
import {LevelManager} from "../utils/managers/LevelManager.ts";
import {Explosion} from "../objects/game/Explosion.ts";


export class Level extends Scene {
    protected bg: Background;
    protected player: Player;
    protected levelManager: LevelManager;

    constructor(key: string = 'level') {
        super(key);
    }

    preload() {
        Background.preload(this);
        Player.preload(this);
        Bullet.preload(this);
        Explosion.preload(this);
    }

    create() {
        this.levelManager = new LevelManager(this);

        // todo должен определяться уровнем
        this.bg = this.add.existing(new Background(this))
        this.bg.create();

        this.player = this.add.existing(new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 30))

        this.levelManager.loadLevel(true);
    }

    update() {
        this.player.update();
    }
}
