const P_ASSETS = 'assets/';
const P_SPRITES = P_ASSETS + 'sprites/';
const P_TEXTURES = P_ASSETS + 'textures/';
const P_DATA = P_ASSETS + 'data/';
const P_LEVELS = P_DATA + 'levels/';

const GAME_WIDTH = 420;
const GAME_HEIGHT = window.innerHeight / (window.innerWidth / GAME_WIDTH);
const GAME_FPS = 60;

const EVENT_WAVE_COMPLETE = 'wave-complete';

const ENEMY_EDGE_OFFSET = 64; // должен быть немного больше чем самый большой враг (боссы не в счёт)

const COLLIDER_PLAYER = 1;
const COLLIDER_ENEMY = 2;

export {
    P_ASSETS,
    P_SPRITES,
    P_TEXTURES,
    P_DATA,
    P_LEVELS,

    GAME_WIDTH,
    GAME_HEIGHT,
    GAME_FPS,

    EVENT_WAVE_COMPLETE,

    ENEMY_EDGE_OFFSET,

    COLLIDER_PLAYER,
    COLLIDER_ENEMY,
}