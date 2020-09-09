import { Game } from './game';
import './css/style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './networking';

let main = () => {
    let game = new Game();
    game.startGame();
}

// kick off main when loaded
let eventWindowLoaded = () => {
    main()
}
window.addEventListener('load', eventWindowLoaded, false);
