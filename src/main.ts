import { AUTO, Game, Scale,Types } from 'phaser';
import { Level } from "./scenes/Level.ts";

import './declare.d.ts';

const GAME_WIDTH = 420;
const GAME_HEIGHT = window.innerHeight / (window.innerWidth / GAME_WIDTH);

const config: Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#000',
    disableContextMenu: true,
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Scale.WIDTH_CONTROLS_HEIGHT,
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
    scene: [Level],
};

export default new Game(config);
