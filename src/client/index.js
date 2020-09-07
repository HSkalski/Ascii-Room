import { Game } from './game'
import {render} from './render'

import './css/style.css'


let game = new Game();

let main = () => {
    game.startGame();
}




// kick off main when loaded
let eventWindowLoaded = () => {
    main()
}
window.addEventListener('load', eventWindowLoaded, false);