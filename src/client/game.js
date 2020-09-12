// has player info, takes input from input.js, outputs to renderer
import { render } from './render';
import { handleKeyInput } from './input';
import { sendUpdate } from './networking';
const Constants = require('./constants');
let {MAP_WIDTH, MAP_HEIGHT, PLAYER_MOV_SPEED, PLAYER_ROT_SPEED} = Constants;


export class Game{

    constructor(){

        console.log("Game Constructor")
        this.playerX = 1;
        this.playerY = 11;
        this.playerA = 2.7;

        this.others = {};

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
        this.map[3]= ['#','.','.','#','#','#','#','.','.','.','.','.','.','.','.','#'];
        this.map[4]= ['#','.','.','#','.','.','#','.','.','.','.','.','.','.','.','#'];
        this.map[5]= ['#','.','.','#','.','.','#','.','.','.','.','.','.','.','.','#'];
        this.map[6]= ['#','.','.','#','.','.','#','.','.','.','.','.','.','.','.','#'];
        this.map[7]= ['#','.','.','#','.','#','#','.','.','.','.','.','.','.','.','#'];
        this.map[8]= ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[9]= ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[10]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[11]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[12]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[13]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[14]=['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'];
        this.map[15]=['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'];

        //this.map[Math.round(this.playerY)-1][Math.round(this.playerX)-1] = '@';

        this.lastUpdate = Date.now();
        this.dt = 0; // ms between frames
        this.fps = 0;

    }


    getState(){
        return {
            mapData: this.map,
            pX: this.playerX,
            pY: this.playerY,
            pA: this.playerA,
            others: this.others
        }
    }

    updateTime(){
        let now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
        this.fps = parseInt(1000/this.dt);
    }

    updateMove(){
        let input = handleKeyInput();
        if(input.mF){

            this.playerX += Math.sin(this.playerA) * PLAYER_MOV_SPEED * this.dt;
            this.playerY += Math.cos(this.playerA) * PLAYER_MOV_SPEED * this.dt;
        }
        if(input.mB){
            this.playerX -= Math.sin(this.playerA) * PLAYER_MOV_SPEED * this.dt;
            this.playerY -= Math.cos(this.playerA) * PLAYER_MOV_SPEED * this.dt;
        }
        if(input.sL){ 
            this.playerX += Math.sin(this.playerA + (Math.PI/2)) * PLAYER_MOV_SPEED * this.dt;
            this.playerY += Math.cos(this.playerA + (Math.PI/2)) * PLAYER_MOV_SPEED * this.dt;
        }
        if(input.sR){
            this.playerX += Math.sin(this.playerA - (Math.PI/2)) * PLAYER_MOV_SPEED * this.dt;
            this.playerY += Math.cos(this.playerA - (Math.PI/2)) * PLAYER_MOV_SPEED * this.dt;
        }

        this.playerA -= input.dM * PLAYER_ROT_SPEED * 2;

        //console.log("X: ",Math.round(this.playerX)," Y: ", Math.round(this.playerY));
        //console.log("X: ",this.playerX.toFixed(2)," Y: ", this.playerY.toFixed(2));
    }
    
    // ray traced collision management
    // needs more rays, currently clips outer corners and goes through inner corners
    handleCollision(){
        if(this.map[Math.round(this.playerY)][Math.round(this.playerX)] == '#' ){
            console.log("Collision!");
            let airFound = false;
            let rayStep = 0.00005;
            let rays = [{dir: 0, X: this.playerX, Y: this.playerY}, 
                {dir: Math.PI/2, X: this.playerX, Y: this.playerY}, 
                {dir: Math.PI, X: this.playerX, Y: this.playerY}, 
                {dir: 3*Math.PI/2, X: this.playerX, Y: this.playerY}];

            while(!airFound){
                for(let r = 0; r < rays.length; r++){ 
                    rays[r].X += Math.sin(rays[r].dir) * rayStep * this.dt 
                    rays[r].Y += Math.cos(rays[r].dir) * rayStep * this.dt 
                    
                    console.log(Math.round(rays[r].X), Math.round(rays[r].Y), (this.map[Math.round(rays[r].Y)] [Math.round(rays[r].X)]));
                    
                    if(this.map[Math.round(rays[r].Y)] [Math.round(rays[r].X)] != "#"){
                        console.log("Found air")
                        this.playerX = rays[r].X
                        this.playerY = rays[r].Y
                        airFound = true
                    }
                }
            }
        }
    }

    handleOtherUpdate(data){
        //update others object
        //console.log(data);
        this.others = data;
    }

    handleSendUpdate(){
        sendUpdate({x: this.playerX, y: this.playerY});
    }

    update(){
        //console.log("lööp brøther")
        //      Process:
        // Get input, translate character
        this.updateMove();
        //check for / handle collision
        this.handleCollision();

        // get most recent other positions from networking
        this.handleSendUpdate();

        // render frame
        render(this.getState());

        // get delta T
        this.updateTime();
    }

    startGame(){
        setInterval(this.update.bind(this), 1000/30)
        //this.update();
    }

    setSens(sens){
        PLAYER_ROT_SPEED = sens;
    }
}
