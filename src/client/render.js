//get state from game.js, ray traces scene and draws others
// eventually move state to state.js instead of game

//BUG: 
// rendered X is flipped from map from some reason
//  Temp 'FIX':
//      swapped ray angle which fixed rendering but then strafe left/right and turn left/right controls were inverted, changed in updateMove

const Constants = require('../constants');
let {MAP_WIDTH, MAP_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT, STEP_SIZE, RENDER_DIST, PLAYER_FOV, WALL_SHADES, FLOOR_SHADES,TOP_SHADES} = Constants;

let gameDiv = document.getElementById('gameDiv');

// init 2d screen buffer array
let screenBuff = new Array(SCREEN_WIDTH);
for(let i = 0; i < SCREEN_WIDTH; i++){
    screenBuff[i] = new Array(SCREEN_HEIGHT);
}
// depth map for determining wheather to render another player
let depthMap = new Array(SCREEN_WIDTH);
export let render = (state) => {
    sceneRender(state);
    otherRender(state);
    mapRender(state);
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
        for(let i = 1; i < Object.keys(WALL_SHADES).length - 1; i++){      
            if(distToWall < interval*i){
                shade = WALL_SHADES[i-1];
                break;
            }
        }
        
        //remove fisheye on height of walls by projecting euclidean distance found to player angle
        //  Happens after distance calculation to get euclidean dist shading
        //  edit: changes look based on fov
        distToWall = distToWall * Math.cos(rA-pA);
        depthMap[x] = distToWall; // update depth map info
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

let drawRect = (x,y,w,h,symbol) => {
    //sanitize input
    x = parseInt(x);
    y = parseInt(y);
    w = parseInt(w);
    h = parseInt(h);
    //console.log("DrawRect: ", x, y, w, h);
    if(x+w < SCREEN_WIDTH && y+h < SCREEN_HEIGHT && x >= 0 && y >= 0){ //if rectagle is completely within the screen
        for(let i = 0; i < h; i++){
            for(let j = 0; j < w; j++){
                if(i == 0 || i == h-1 || j == 0 || j == w-1){
                    screenBuff[y+i][x+j] = symbol;
                } else {
                    screenBuff[y+i][x+j] = " ";
                }
            }
        }
    } else { // if rectangle isn't within the screen, then just draw what you can while checking
        for(let i = 0; i < h; i++){
            for(let j = 0; j < w; j++){
                if(y+i < SCREEN_HEIGHT && x+j < SCREEN_WIDTH && x+j >= 0 && y+i >= 0){
                    if(i == 0 || i == h-1 || j == 0 || j == w-1){
                        screenBuff[y+i][x+j] = symbol;
                    } else {
                        screenBuff[y+i][x+j] = " ";
                    }
                }
            }
        }
    }
}
// BUG: 
//     Others don't render in order of distance so they overlap sometimes.
let otherRender = (state) => {
    let {others, mapData, pX, pY, pA} = state;
    Object.keys(others).forEach( ( otherID ) => {
        let otherX = others[otherID].x;
        let otherY = others[otherID].y;
        let otherA = 0;
        let otherDist = Math.pow( Math.pow( pX - otherX, 2) + Math.pow(pY - otherY, 2), 0.5 ); //distance between player and other
        let diffX = otherX - pX;
        let diffY = otherY - pY;
        let angOff = Math.atan2(diffY, diffX) - Math.PI/2; //Angle from any quadrant between player and other off X axis
        otherA = angOff - (-1*pA)%(Math.PI*2) // find the difference, invert player angle to account for atan2, mod 360deg
        if(otherA < -1*Math.PI) // scale it to half circle +/-
            otherA+=2*Math.PI
        if(otherA > Math.PI)
            otherA-=2*Math.PI

        if(otherA > -1*PLAYER_FOV/2 && otherA < PLAYER_FOV/2){ // Other is within FOV
            let sliceWidth = (PLAYER_FOV) / (SCREEN_WIDTH) // Width of each column
            let slice = parseInt(otherA / sliceWidth) // determine which column center of other is in
            let otherHeight = SCREEN_HEIGHT / otherDist;

            // curret object occlusion -
            // better way to do it would be to cast a few rays at parts, deterimining which parts of the other to draw
            if(otherDist < (depthMap[parseInt(SCREEN_WIDTH/2+slice)])){ // if other is closer than closest wall
                drawRect(SCREEN_WIDTH/2+slice - otherHeight/2, SCREEN_HEIGHT/2 - otherHeight/3, otherHeight, otherHeight, "#");
            }
        }

    });



}

let mapRender = (state) => {
    //console.log("Rendering Map")
    let h = 25
    //(Math.min(MAP_HEIGHT,MAP_WIDTH)
    let mapScale = Math.floor(3 - Math.min(MAP_HEIGHT,MAP_WIDTH)/30); // auto scale map
    if(mapScale < 1){ mapScale = 1; }
    let yOff = 3;
    let xOff = SCREEN_WIDTH - MAP_WIDTH * mapScale - 5;
    let pXint = parseInt(state.pX+.5); // plus .5 to deal with render offset of world
    let pYint = parseInt(state.pY+.5);
    for(let y = 0; y < MAP_HEIGHT * mapScale; y++){
        for(let x = 0; x < MAP_WIDTH* mapScale; x++){
            //console.log(state.mapData[parseInt(y/mapScale)][parseInt(x/mapScale)]);
            console.log(y+yOff, x+xOff);
            screenBuff[y+yOff][x+xOff] = state.mapData[parseInt(y/mapScale)][parseInt(x/mapScale)];
            if(parseInt(y/mapScale) == pYint && parseInt(x/mapScale) == pXint){
                screenBuff[y+yOff][x+xOff] = '@';
            }
        }
    }
}
let boarderRender = () => {
    //console.log("Rendering Boarder")
    for(let y = 0; y < SCREEN_HEIGHT; y++){
        if(y == 0 || y == SCREEN_HEIGHT-1){
            for(let x = 0; x < SCREEN_WIDTH; x++){
                screenBuff[y][x] = '-';
            }
        }else{
            screenBuff[y][0] = '|';
            screenBuff[y][SCREEN_WIDTH-1] = '|';
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

export let setFOV = (nFovDeg) => {
    PLAYER_FOV = nFovDeg * Math.PI / 180;
} 