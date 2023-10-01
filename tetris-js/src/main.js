import '../style.css'
import { Tetris } from './class.js'

document.querySelector('#app').innerHTML = `
<h1>Tetris App</h1>

<div id="app-container">

    <div id="game container">
        <div class="game-over" id="game-over">
            <span id=msg></span>
        </div>
        <div id="game"></div>
    </div>

    <div id="controls">
        <h2>Controls:</h2>
        <ol id="ctrl-list">
            <li> ← → ↓ to move </li>
            <li> ↑ to rotate </li>
            <li> SPACE-BAR to pause/play </li>
            <li> R to restart </li>
        </ol>
        <div id="difficulty"></div>
        <div id="score"></div>
    </div>

</div>
`
export const msgContainer = document.getElementById("game-over")
export const msg = document.getElementById("msg")

let game = new Tetris(10, 20);
game.start()