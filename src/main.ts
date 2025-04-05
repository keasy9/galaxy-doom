import { AUTO, Game, Scale,Types } from 'phaser';
//import { Boot } from './scenes/Boot.ts';
//import { Menu } from "./scenes/Menu.ts";
import { Level } from "./scenes/Level.ts";

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 420,
    height: 270,
    parent: 'game-container',
    backgroundColor: '#000',
    disableContextMenu: true,
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Scale.ENVELOP,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [
        // Boot,
        // Menu,
        Level
    ],
};

export default new Game(config);
