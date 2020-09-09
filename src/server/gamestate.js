


class GameState{
    constructor() {
        this.sockets = {};
        this.players = {};
        setInterval(this.update.bind(this), 1000/30);
    }

    addPlayer(socket){
        
    }
    updatePlayer(socket, data){

    }
    removePlayer(socket){

    }

    update(){

    }
}

module.exports = GameState;
