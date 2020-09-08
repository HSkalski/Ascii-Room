import { Game } from './game'

import './css/style.css'




let main = () => {
    let game = new Game();
    game.startGame();
}





// kick off main when loaded
let eventWindowLoaded = () => {
    main()
}
window.addEventListener('load', eventWindowLoaded, false);
