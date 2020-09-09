


class GameState{
    constructor() {
        this.players = {};
        setInterval(this.update.bind(this), 1000/30);
    }

    addPlayer(socket){
        this.players[socket.id] = {socket: socket, x: 0, y: 0};
    }
    updatePlayer(socket, data){
        this.players[socket.id].x = data.x;
        this.players[socket.id].y = data.y;
        
    }
    removePlayer(socket){
        delete this.players[socket.id];
    }
    sendUpdates(){
        Object.keys(this.players).forEach( (socketID) => {
            //console.log(socketID);
            let others = {}
            Object.keys(this.players).forEach( (otherID) => {
                //console.log(socketID+" "+otherID);
                if(socketID != otherID){
                    //console.log(others[otherID]);
                    let other = {x: this.players[otherID].x, y: this.players[otherID].y};
                    others[otherID] = other;
                }
            })
            //console.log(others);
            this.players[socketID].socket.emit('playerUpdate', others)
        });
    }
    update(){
        // eventualy do server calculations here
        this.sendUpdates();
    }
}

module.exports = GameState;
