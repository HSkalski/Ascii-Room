# 
<pre>
    ___   _____ ______________            ____  ____  ____  __  ___
   //  | / ___// ____/  _/  _/           //__ \/ __ \/ __ \/  |/  / 
  ///| | \__ \/ /    / / / /   ______   ///_/ / / / / / / / /|_/ /  
 //___ |___/ / /____/ /_/ /   /_____/  //_, _/ /_/ / /_/ / /  / /  
///  |_/____/\____/___/___/           /// |_|\____/\____/_/  /_/   

A 2 1/2 D rendered multiplayer game without using canvas
</pre>

[Live Project Link](https://ascii-room.herokuapp.com/)
## About
This enigne works by casting rays from a players location into a 2d top down view of the players enviroment. The distance of the ray determines the hight of the wall to render at that location. 

Player rendering works currently by finding its angle offset relative to infront of the player, then get what slice of the screen the center of the other player should be and draw a rectangle proportional to the distance away.The other player will not be rendered if there is a wall closer than the center of it. 

[Wikipedia 2.5D Graphics](https://en.wikipedia.org/wiki/2.5D)

[Computer Graphics Ray Casting Resource](https://lodev.org/cgtutor/raycasting.html)

This project utilises a node.js webserver using socket.io to create a multiplayer experience in a 2.5D world. 
## Setup Instructions

1. `> git clone https://github.com/HSkalski/Ascii-Room.git`
2. `> cd ascii-room`
3. `> npm install`
4. `> npm install`
4. `> npm run dev` For local hosting and development
5. `> npm run build` For compiling to dist
6. `> npm run start` For hosting from dist

## //TODO

| Objective | Progress|
|  ---      | ---     |
| Better player occlusion | Planned |
| Bottom Bar Controls/Settings/About | Started |
| Larger world Testing| Planned |
| Procedural worlds | Looking into it |