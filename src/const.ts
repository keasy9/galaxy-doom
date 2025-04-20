const GAME_WIDTH = 420;
const GAME_HEIGHT = window.innerHeight / (window.innerWidth / GAME_WIDTH);
const GAME_FPS = 60;

const EVENT_WAVE_COMPLETE = 'wave-complete';

const ENEMY_EDGE_OFFSET = 64; // должен быть немного больше чем самый большой враг (боссы не в счёт)

export {
    GAME_WIDTH,
    GAME_HEIGHT,
    GAME_FPS,

    EVENT_WAVE_COMPLETE,

    ENEMY_EDGE_OFFSET,
}