import { Game } from './game';
import './css/style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './networking';

let game = new Game();

let main = () => {
    game.startGame();
}

// kick off main when loaded
let eventWindowLoaded = () => {
    main()
}
window.addEventListener('load', eventWindowLoaded, false);

export const handleUpdate = (others) => {
    game.handleOtherUpdate(others);
}

export let setSens = (nSens) => {
    game.setSens(nSens)
}

let playerCountP = document.getElementById("playerCount");
export let setPlayerCount = (num) => {
    playerCountP.innerHTML = "Players Connected: "+num;
}