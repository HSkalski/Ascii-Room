//get state from game.js, ray traces scene and draws others
// eventually move state to state.js instead of game

//BUG: 
// rendered X is flipped from map from some reason
//  'FIX':
//      swapped ray angle which fixed rendering but then strafe left/right and turn left/right controls were inverted, changed in updateMove

const Constants = require('./constants');
const {MAP_WIDTH, MAP_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT, STEP_SIZE, RENDER_DIST, PLAYER_FOV, WALL_SHADES, FLOOR_SHADES,TOP_SHADES} = Constants;

let gameDiv = document.getElementById('gameDiv');

// init 2d screen buffer array
let screenBuff = new Array(SCREEN_WIDTH);
for(let i = 0; i < SCREEN_WIDTH; i++){
    screenBuff[i] = new Array(SCREEN_HEIGHT);
}
export let render = (state) => {
    sceneRender(state);
    otherRender(state);
    //mapRender(state);
    boarderRender();
    sendToDiv();
}

// Ray Casting 2 1/2 D renderer, similar to that of Wolfenstein3D
let sceneRender = (state) => {
    let {mapData, pX, pY, pA} = state;
    //console.log("Rendering Scene")

    for(let x = 0; x < SCREEN_WIDTH; x++){
        let rA = (pA + PLAYER_FOV/2) - (x / SCREEN_WIDTH) * PLAYER_FOV; // calculate angle of current ray being cast
        
        //   1/2 of of fov on each side, offset with current column 
        //         1/2   1/2
        //        \    |    /
        //         \   |   /
        //          \  |  /
        let distToWall = 0; //hold the distance to wall or max render distance

        let hitWall = false; // flag for when to stop adding distance to ray

        let uX = Math.sin(rA); // make unit vector sides out of player angle
        let uY = Math.cos(rA);

        while(!hitWall && distToWall < RENDER_DIST){ // while ray has not collided with a wall and not exceeded render distance

            distToWall += STEP_SIZE; // add distance to ray

            let testX = Math.round( pX + uX * distToWall ); // cast current ray and convert to integer space of the map
            let testY = Math.round( pY + uY * distToWall );

            if(testX < 0 || testX >= MAP_WIDTH || testY < 0 || testY >= MAP_HEIGHT){ // check if ray is out of bounds
                hitWall = true;
                distToWall = RENDER_DIST;
            }else{
                if(mapData[testY][testX] == '#'){ // if ray is in bounds, check if '#' has been found at that spot in the map
                    hitWall = true;
                }
            }
        }

        //choose level of darkness based on distance
        let interval = RENDER_DIST/(Object.keys(WALL_SHADES).length - 1);
        let shade = ' ';
        for(let i = 0; i < Object.keys(WALL_SHADES).length - 1; i++){
            if(distToWall < interval*i){
                shade = WALL_SHADES[i];
                break;
            }
        }
        
        //remove fisheye on height of walls by projecting euclidean distance found to player angle
        //  Happens after distance calculation to get euclidean dist shading
        //  edit: changes look based on fov
        distToWall = distToWall * Math.cos(rA-pA);

        // calculate top and bottom of wall in this row 
        let wallTop = (SCREEN_HEIGHT/2) - ( SCREEN_HEIGHT / (1.5*distToWall) ); ///half the height of screen minus a proportion of the screenheight depending on distance to wall
        let wallBot = SCREEN_HEIGHT - wallTop;// flipped onto the bottom

        for(let y = 0; y < SCREEN_HEIGHT; y++){
            if(y < wallTop){
                screenBuff[y][x] = TOP_SHADES[0];
            }else if(y > wallTop && y <= wallBot){
                screenBuff[y][x] = shade;
            } else {
                let b = 1 - ( (y-(SCREEN_HEIGHT/2)) / (SCREEN_HEIGHT - (SCREEN_HEIGHT/2) ) ) //normalize to 1, invert it
                if     (b < 0.25) shade = FLOOR_SHADES[3];
                else if(b < 0.5)  shade = FLOOR_SHADES[2];
                else if(b < 0.75) shade = FLOOR_SHADES[1];
                else if(b < 0.9)  shade = FLOOR_SHADES[0];
                screenBuff[y][x] = shade;
            }
        }

    }
}

let otherRender = (state) => {
    //console.log("Rendering Others")
}

let mapRender = (state) => {
    //console.log("Rendering Map")
    for(let y = 0; y < MAP_HEIGHT; y++){
        for(let x = 0; x < SCREEN_WIDTH; x++){
            screenBuff[y][x] = state.mapData[y][x];//state.mapData[Math.round(y/2)][Math.round(x/2)];
        }
    }
}
let boarderRender = () => {
    //console.log("Rendering Boarder")
    for(let y = 0; y < SCREEN_HEIGHT; y++){
        if(y == 0 || y == SCREEN_HEIGHT-1){
            for(let x = 0; x < SCREEN_WIDTH; x++){
                screenBuff[y][x] = '#';
            }
        }else{
            screenBuff[y][0] = '#';
            screenBuff[y][SCREEN_WIDTH-1] = '#';
        }

    }
}

let sendToDiv = () => {
    let screen = "";
    for(let y = 0; y < SCREEN_HEIGHT; y++){
        screen += screenBuff[y].join('');
        screen+='\n'
    }
    gameDiv.innerHTML = screen; // send final frame to screen
}