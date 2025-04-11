import { AUTO, Game, Scale,Types } from 'phaser';
import { Level } from "./scenes/Level.ts";

import './declare.d.ts';

const GAME_WIDTH = 420;
const GAME_HEIGHT = window.innerHeight / (window.innerWidth / GAME_WIDTH);
/**
 * todo спрайты, текстуры и всё остальное движется не плавно, а попиксельно. Но возможно это и не проблема, а только кажется ею
 *  - пробовал увеличить размер игры и задать камере зум, нет никакой разницы
 */

const config: Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#000',
    disableContextMenu: true,
    pixelArt: true,
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
    fps: {
        target: 60,
    },
    scene: [Level],
};

export default new Game(config);
