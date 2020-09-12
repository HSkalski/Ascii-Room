import { setFOV } from './render';
import { setSens } from './index';

let gameDiv = document.getElementById("gameDiv");

let strafeLeft = false, strafeRight = false, moveFwd = false, moveBack = false;
let deltaMouse = 0
let isFocused = false;

let sensSlider = document.getElementById('sensSlider');
let fovSlider = document.getElementById('fovSlider');



export let handleKeyInput = () => {
    let tempMouse = deltaMouse;
    deltaMouse = 0;
    if(isFocused){
        return {
            sL: strafeLeft,
            sR: strafeRight,
            mF: moveFwd,
            mB: moveBack,
            dM: tempMouse,
        }
    }else{
        return {
            sL: false,
            sR: false,
            mF: false,
            mB: false,
            dM: 0,
        }
    }
}

//Listen for key presses
document.addEventListener("keydown", function(e){
    switch(e.keyCode){
        case 65: //a 
        strafeLeft = true
            break;
        case 68: //d
        strafeRight = true
            break;
        case 87: //w
            moveFwd = true
            break;
        case 83: //s
            moveBack = true
            break;
        case 37: // <-
            turnLeft = true
            break;
        case 39: // ->
            turnRight = true
            break;
        case 107: // keypad +
            increaseRes = true
            break;
        case 109: // keypad -
            decreaseRes = true
            break;

    }
})

//Listen for key releases
document.addEventListener("keyup", function(e){
    switch(e.keyCode){
        case 65: //a
            strafeLeft = false
            break;
        case 68: //d
        strafeRight = false
            break;
        case 87: //w
            moveFwd = false
            break;
        case 83: //s
            moveBack = false
            break;
        case 37: // <-
            turnLeft = false
            break;
        case 39: // ->
            turnRight = false
            break;
        case 107: // keypad +
            increaseRes = false
            break;
        case 109: // keypad -
            decreaseRes = false
            break;
        default:
            break;
    }
})

//Pointer lock setup
//The pointer lock API is used so 3D like camera controls can be achived using the mouse
gameDiv.requestPointerLock = gameDiv.requestPointerLock || gameDiv.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

gameDiv.onclick = () => {
    gameDiv.requestPointerLock();
}

let lockChangeAlert = () => {
    if(document.pointerLockElement === gameDiv ||
    document.mozPointerLockElement === gameDiv){
        console.log('The Pointer is LOCKED')
        isFocused = true;
        document.addEventListener("mousemove", cameraLoop, false);
    } else {
        console.log('The Pointer is UNNLOCKED')
        isFocused = false;
        document.removeEventListener("mousemove", cameraLoop, false)
    }
}

let cameraLoop = (e) => {
    //console.log("Mouse Movement X: "+e.movementX)
    deltaMouse += e.movementX;
}

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

fovSlider.oninput = () => {
    setFOV(fovSlider.value);
}

sensSlider.oninput = () => {
    setSens(sensSlider.value/50000);
}