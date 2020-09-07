//get state from game.js, ray traces scene and draws others
// eventually move state to state.js instead of game

const Constants = require('./constants');
const {MAP_WIDTH, MAP_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT, STEP_SIZE, RENDER_DIST} = Constants;

// init 2d screen buffer array
let screenBuff = new Array(SCREEN_WIDTH);
for(let i = 0; i < SCREEN_WIDTH; i++){
    screenBuff[i] = new Array(SCREEN_HEIGHT);
}

export let render = (state) => {
    sceneRender(state);
    otherRender(state);
}

let sceneRender = (state) => {
    console.log("Rendering Scene")
    
}

let otherRender = (state) => {
    console.log("Rendering Others")
}
