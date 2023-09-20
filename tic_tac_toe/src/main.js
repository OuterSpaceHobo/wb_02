import '../style.css'
import { saveGameState, cleanGameState, loadState } from './serviceLocalStorage'
import { checkWin, checkDraw } from './checkWin'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Tic-Tac-Toe</h1>

    <div class="inputs__box">
      <label class="input__container" for="twoPlayers">Two Players
        <input type="radio" id="twoPlayers" name="gameMode" checked>
        <span class="checkmark"></span>
      </label>
      <label class="input__container" for="againstComputer">Against Computer
        <input type="radio" id="againstComputer" name="gameMode">
        <span class="checkmark"></span>
      </label>
    </div>

    <div id="turn__container" style="margin: 5px;">
      <span style="margin: 50px;" id="player__turn">X turn to move</span>
    </div>

    <div class="board">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="msg__container" id="msg__container">
          <span id="message" class="message"></span>
        </div>
    </div>
    <br />
    <button id="new__game__btn" class="disable" onclick="startNewGame()">New Game</button>
  </div>
`

const newGameBtn = document.getElementById("new__game__btn")
const msg = document.getElementById("msg__container")
const msgText = document.getElementById("message")
const turnMsg = document.getElementById("turn__container")
newGameBtn.classList.contains("disable") ? newGameBtn.classList.add("disable") : ''
const twoPlayersMode = document.getElementById("twoPlayers")
const againstComputerMode = document.getElementById("againstComputer")

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let againstComputer = false;

const cells = document.querySelectorAll(".cell");
cells.forEach(cell => cell.addEventListener("click", handleCellClick));

twoPlayersMode.onchange = function() {
  againstComputer = false;
  startNewGame();
}

againstComputerMode.onchange = function() {
  againstComputer = true;
  startNewGame();
}

function handleCellClick(event) {
  newGameBtn.classList.contains("disable") ? newGameBtn.classList.remove("disable") : ''
  const clickedCell = event.target;
  const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
      return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.style.color = currentPlayer === "X" ? "blue" : "red";

  if (checkWin(gameState)) {
      cleanGameState()
      msgText.textContent = `Player ${currentPlayer} wins!`;
      msg.classList.add(`visible`);
      turnMsg.textContent = `Game over.`;
      gameActive = false;
      return;
  }

  if (checkDraw(gameState)) {
      cleanGameState()
      msgText.textContent = "It's a draw!";
      msg.classList.add(`visible`);
      turnMsg.textContent = `Game over.`;
      gameActive = false;
      return;
  }
  
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  againstComputer ? turnMsg.textContent = `Make a move!` : turnMsg.textContent = `${currentPlayer} turn to move`

  if (againstComputer && currentPlayer === "O" && gameActive) {
      makeComputerMove();
  }

  saveGameState(gameState, currentPlayer, gameActive, againstComputer);
}

function startNewGame() {
  msg.classList.contains("visible") ? msg.classList.remove("visible") : ''
  newGameBtn.classList.contains("disable") ? '' : newGameBtn.classList.add("disable")
  cleanGameState()

  currentPlayer = "X";
  againstComputer ? turnMsg.textContent = `Make a move!` : turnMsg.textContent = `${currentPlayer} turn to move`
  
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  msgText.textContent = "";
  cells.forEach(cell => {
      cell.textContent = "";
      cell.style.color = "black";
  });

  if (againstComputer && currentPlayer === "O") {
      makeComputerMove();
  }

  saveGameState(gameState, currentPlayer, gameActive, againstComputer);
}
window.startNewGame = startNewGame

function makeComputerMove() {
  const availableCells = [];
  for (let i = 0; i < gameState.length; i++) {
      if (gameState[i] === "") {
          availableCells.push(i); 
      } 
    } 
  const randomIndex = Math.floor(Math.random() * availableCells.length); 
  const cellIndex = availableCells[randomIndex];
  gameState[cellIndex] = currentPlayer;
  cells[cellIndex].textContent = currentPlayer;
  cells[cellIndex].style.color = currentPlayer === "X" ? "blue" : "red";

  if (checkWin(gameState)) {
      cleanGameState()
      msgText.textContent = `Player ${currentPlayer} wins!`;
      msg.classList.add(`visible`);
      gameActive = false;
      return;
  }
  
  if (checkDraw(gameState)) {
      cleanGameState()
      msgText.textContent = `It's a draw!`;
      msg.classList.add(`visible`);
      gameActive = false;
      return;
  }

  else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      saveGameState(gameState, currentPlayer, gameActive, againstComputer);
    }

}

async function loadGameState() {
  let { savedGameState, savedCurrentPlayer, savedGameActive, savedAgainstComputer } = await loadState()

  if (savedGameState && savedCurrentPlayer && savedGameActive && savedAgainstComputer) {

      savedGameState.includes('X') || savedGameState.includes('O') ? 
      newGameBtn.classList.remove("disable") : ''

      gameState = JSON.parse(savedGameState);
      currentPlayer = savedCurrentPlayer;

      gameActive = savedGameActive === "true";
      againstComputer = savedAgainstComputer === "true";

      const radio = document.getElementById("againstComputer")

      againstComputer ? 
      radio.checked = true : radio.checked = false;

      againstComputer ?
      turnMsg.textContent = `Make a move!` : turnMsg.textContent = `${currentPlayer} turn to move`

      cells.forEach((cell, index) => {
          cell.textContent = gameState[index];
          cell.style.color = gameState[index] === "X" ? "blue" : "red";
      });
  }
}

loadGameState();