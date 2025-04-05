import { Start } from './scenes/Start.ts';
import { AUTO, Game, Scale,Types } from 'phaser';

//  Find out more information about the Start Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
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
    scene: [Start],
};

export default new Game(config);
