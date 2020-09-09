// update from server
// send updates to server

import io from 'socket.io-client'
import { handleUpdate } from './index';
const socket = io();

socket.on('connect', () => {
    console.log("Connected");
})

export const sendUpdate = (state) => {
    //console.log(state);
    socket.emit('update', state);
}

socket.on('playerUpdate', (others) => {
    handleUpdate(others);
})