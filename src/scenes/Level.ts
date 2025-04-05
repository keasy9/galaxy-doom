import {Scene} from "./Scene.ts";
import {Background} from "../entities/Background.ts";
import {Player} from "../entities/Player.ts";



export class Level extends Scene {
    protected readonly name: string = 'level';

    constructor() {
        super();
        this.entities['background'] = new Background(this);
        this.entities['player'] = new Player(this);
    }
}
