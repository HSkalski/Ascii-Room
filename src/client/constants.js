module.exports = Object.freeze({
    MAP_WIDTH: 16,
    MAP_HEIGHT: 16,

    SCREEN_WIDTH: 300,
    SCREEN_HEIGHT: 100,
    
    RENDER_DIST: 16,
    STEP_SIZE: 0.02,
    
    PLAYER_MOV_SPEED: 0.003,
    PLAYER_ROT_SPEED: 0.0004,
    PLAYER_FOV: 1.04,

    WALL_SHADES: {
        0: '\u2588', // █
        1: '\u2593', // ▓
        2: '\u2592', // ▒
        3: '\u2591', // ░
        4: ' ',
    },
    FLOOR_SHADES:{
        0: '`',
        1: '-',
        2: 'x',
        3: '#',
    },
    TOP_SHADES:{
        0: ' ',
    },
    
});

