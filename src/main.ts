import { AUTO, Game, Scale,Types } from 'phaser';
import {GAME_FPS, GAME_HEIGHT, GAME_WIDTH} from "./const.ts";
import {Level} from "./scenes/Level.ts";
import {Boot} from "./scenes/Boot.ts";
import {Menu} from "./scenes/Menu.ts";
import {Gui} from "./scenes/Gui.ts";

// todo фиксированное разрешение игры, а под экран подстраивать камеру
const config: Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#000',
    disableContextMenu: true,
    pixelArt: true,
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            debugShowVelocity: false,
            debugBodyColor: 0xffffff,
        },
    },
    fps: {
        target: GAME_FPS,
    },
    scene: [Boot, Menu, Level, Gui],
};

export default new Game(config);
