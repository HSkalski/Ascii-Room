
const Constants = require('../constants');

let {MAP_WIDTH, MAP_HEIGHT} = Constants;

let randRange = (min,max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
let evenRange = (min,max) => {
    return Math.floor( randRange(min+1,max) / 2 ) * 2;
}
let oddRange = (min,max) => {
    console.log("odd range: ", min, max);
    return Math.floor( randRange(min,max) / 2 ) * 2 + 1;
}

let printArray = (arr) => {
    for(let y = 0; y < arr.length; y++){
        console.log(arr[y].join());
        // for(let x = 0; x < arr[0].length; x++){
        // }
    }
}

class GameState{
    constructor() {
        this.players = {};
        setInterval(this.update.bind(this), 1000/30);
        this.map = new Array(MAP_WIDTH); // 16x16 by default
        this.waitForNewMap = false;
        for(let i = 0; i < MAP_WIDTH; i++){
            this.map[i] = new Array(MAP_HEIGHT);
        }
        // MAP FORMAT:
        //      map[Y][X] O-->
        //                |
        //                V

        
        this.initChamberMap();

    }

// Chamber method
//  Divide X and Y with wall, create opening in each
// do for each chamber

    initChamberMap(){
        this.initEmptyMap();
        this.addWalls(1, MAP_WIDTH-2, 1, MAP_HEIGHT-2, 1, 3);
        this.addBoarderWall();

        printArray(this.map);
    }

    addWalls(xMin, xMax, yMin, yMax, depth, maxDepth){
        console.log(xMin, xMax, yMin, yMax, "depth: "+depth);
        let xWall=0,yWall=0;
        if(xMin+1 < xMax && xMax-1 > xMin){
            xWall = oddRange(xMin+1,xMax-1);// Odd numbers for walls
        }
        if(yMin+1 < yMax && yMax-1 > yMin){
            yWall = oddRange(yMin+1,yMax-1);
        }
        console.log("y: "+yWall+" x: "+xWall);
        
        for(let x = xMin; x < xMax; x++){
            this.map[yWall][x] = '#';
        }
        for(let y = yMin; y < yMax; y++){
            this.map[y][xWall] = '#';
        }
        this.createHoles(xMin, xMax, yMin, yMax, xWall, yWall);

        printArray(this.map);
        // call for each chamber until depth is reached
        if(depth < maxDepth){
            if(xMin != xWall-1 && yMin != yWall-1)
                this.addWalls(xMin, xWall-1, yMin, yWall-1, depth+1, maxDepth);//top left
            if(xWall+1 != xMax && yMin != yWall-1)
                this.addWalls(xWall+1, xMax, yMin, yWall-1, depth+1, maxDepth);//top right
            if(xMin != xWall-1 && yWall+1 != yMax)
                this.addWalls(xMin, xWall-1, yWall+1, yMax, depth+1, maxDepth);//bottom left
            if(xWall+1 != xMax && yWall+1 != yMax)
                this.addWalls(xWall+1, xMax, yWall+1, yMax, depth+1, maxDepth);// bottom right  
        }
    }

    createHoles(xMin, xMax, yMin, yMax, xWall, yWall){
        //X holes occur in y wall and vice versa
        let x1 = evenRange(xMin,xWall-1), // Even numbers for openings
        x2 = evenRange(xWall+1, xMax),
        y1 = evenRange(yMin, yWall-1),
        y2 = evenRange(yWall+1, yMax);
        // console.log("yMin: "+yMin+" yWall-1: "+(yWall-1));
        // for(let i = 0; i < 20; i++){
        //     console.log( evenRange(yMin, yWall-1) );
        // }
        console.log(x1,x2,y1,y2);
        this.map[yWall][x1] = '.';
        this.map[yWall][x2] = '.';
        this.map[y1][xWall] = '.';
        this.map[y2][xWall] = '.';
    }

    initEmptyMap(){
        for(let y = 0; y < MAP_HEIGHT; y++){
            if(y == 0 || y == MAP_HEIGHT-1){
                for(let x = 0; x < MAP_WIDTH; x++){
                    this.map[y][x] = '#';
                }
            }else{
                for(let x = 0; x < MAP_WIDTH; x++){
                    if(x == 0 || x == MAP_WIDTH-1){
                        this.map[y][x] = '#';
                    }else{
                        this.map[y][x] = '.';
                    }
                }
            }
        }
    }
    addBoarderWall(){
        for(let y = 0; y < MAP_HEIGHT; y++){
            if(y == 0 || y == MAP_HEIGHT-1){
                for(let x = 0; x < MAP_WIDTH; x++){
                    this.map[y][x] = '#';
                }
            }else{
                this.map[y][0] = '#';
                this.map[y][MAP_WIDTH-1] = '#';
            }
        }
    }
    
    addPlayer(socket){
        let spotFound = false;
        let tryX = 0, tryY = 0;
        while(!spotFound){
            tryX = randRange(1,MAP_WIDTH-2);
            tryY = randRange(1,MAP_HEIGHT-2);
            if(this.map[tryY][tryX] != '#'){
                spotFound = true;
            }
        }
        this.players[socket.id] = {socket: socket, x: tryX, y: tryY};
        
        socket.emit('init', {map: this.map, x:tryX, y:tryY});
    }
    updatePlayer(socket, data){
        this.players[socket.id].x = data.x;
        this.players[socket.id].y = data.y;
        
    }
    removePlayer(socket){
        delete this.players[socket.id];
        if(Object.keys(this.players).length == 0){
            this.initChamberMap();
        }
    }
    sendUpdates(){
        Object.keys(this.players).forEach( (socketID) => {
            //console.log(socketID);
            let others = {};
            Object.keys(this.players).forEach( (otherID) => {
                //console.log(socketID+" "+otherID);
                if(socketID != otherID){
                    //console.log(others[otherID]);
                    let other = {x: this.players[otherID].x, y: this.players[otherID].y};
                    others[otherID] = other;
                }
            })
            //console.log(others);
            this.players[socketID].socket.emit('playerUpdate', others);
        });
    }
    update(){
        // eventualy do server calculations here
        this.sendUpdates();

    }
}

module.exports = GameState;
