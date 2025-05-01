import {AUTO, Game, Scale, Types} from 'phaser';
import {Level} from "./scenes/Level.ts";
import {Boot} from "./scenes/Boot.ts";
import {Home} from "./scenes/Home.ts";
import {Gui} from "./scenes/Gui.ts";

const TARGET_GAME_RESOLUTION = 420;
let gameWidth, gameHeight;
if (window.innerWidth > window.innerHeight) {
    gameWidth = 420;
    gameHeight = window.innerHeight / (window.innerWidth / TARGET_GAME_RESOLUTION);
} else {
    gameHeight = 420;
    gameWidth = window.innerWidth / (window.innerHeight / TARGET_GAME_RESOLUTION);
}

export const GAME_FPS = 60;

const config: Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#000',
    disableContextMenu: true,
    pixelArt: true,
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: gameWidth,
        height: gameHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            debugShowVelocity: false,
            debugBodyColor: 0xffffff,
        },
    },
    fps: {target: GAME_FPS},
    scene: [Boot, Home, Level, Gui],
};

export default new Game(config);
