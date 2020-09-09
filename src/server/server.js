const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackConfig = require('../../webpack.dev.js')
const socketio = require('socket.io')
const GameState = require('./gamestate');

if (process.env.NODE_ENV === 'development') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    console.log("Dev Mode")
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
} else {
    console.log("Prod Mode")
    app.use(express.static('dist'));
}

const PORT = process.env.PORT || 2200;
const server = app.listen(PORT);
console.log("Server started on port ", PORT);


const io = socketio(server);

io.on('connection', (socket) => {
    console.log("Connection: ", socket.id);
    socket.on('connect', handleConnect);
    socket.on('update', handleUpdate);
    socket.on('disconnect', handleDisconnect);
});

const gs = new GameState();

let handleConnect = () => {
    gs.addPlayer(this);
}
let handleUpdate = (data) => {
    gs.updatePlayer(this, data);
}
let handleDisconnect = () => {
    gs.removePlayer(this);
}