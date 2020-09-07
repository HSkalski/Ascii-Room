// has player info, takes input from input.js, outputs to renderer
import { render } from './render';
const Constants = require('./constants');
const {MAP_WIDTH, MAP_HEIGHT} = Constants;

require('./input')

export class Game{

    constructor(){

        console.log("Game Constructor")
        this.playerX = 13;
        this.playerY = 4;
        this.playerA = 0;

        //Init map matrix
        this.map = new Array(MAP_WIDTH); // 16x16 by default
        for(let i = 0; i < MAP_WIDTH; i++){
            this.map[i] = new Array(MAP_HEIGHT);
        }
        // MAP FORMAT:
        //      map[Y][X] O-->
        //                |
        //                V
        //

        this.map[0]= ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'];
        this.map[1]= ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[2]= ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[3]= ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[4]= ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[5]= ['#','.','.','.','.','#','#','.','.','#','#','.','.','.','.','#'];
        this.map[6]= ['#','.','.','.','.','#','.','.','.','.','#','.','.','.','.','#'];
        this.map[7]= ['#','.','.','.','.','#','.','.','.','.','#','.','.','.','.','#'];
        this.map[8]= ['#','.','.','.','.','#','.','.','.','.','#','.','.','.','.','#'];
        this.map[9]= ['#','.','.','.','.','#','.','.','.','.','#','.','.','.','.','#'];
        this.map[10]=['#','.','.','.','.','#','#','#','#','#','#','.','.','.','.','#'];
        this.map[11]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[12]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[13]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[14]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[15]=['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'];

        this.map[Math.round(this.playerY)-1][Math.round(this.playerX)-1] = '@';

        this.lastUpdate = Date.now();
        this.dt = 0; // ms between frames
        this.fps = 0;

    }


    getState(){
        console.log(this.map);
        return {
            mapData: this.map,
            pX: this.playerX,
            py: this.playerY,
            pA: this.playerA
        }
    }

    updateTime(){
        let now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
        this.fps = parseInt(1000/this.dt);
    }

    updateMove(){
        
    }

    update(){
        console.log("lööp brøther")
        //      Process:
        // Get input
        
        // translate character
        this.updateTime()

        // get most recent other positions from networking


        // render frame
        render(this.getState());
        // get delta T
        this.updateTime();
    }

    startGame(){
        //setInterval(this.update.bind(this), 1000)
        this.update();
    }
}
