import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Guess the Number</h1>
    <label for="guess">Enter your guess (number or range):</label>
    <input type="text" id="guess" placeholder="e.g. 50 or 1-100" oninput="checkInput(value)">
    <button id="submit__btn" class="disable" onclick="checkGuess()">Submit</button>
    <p id="message"></p>
    <p id="attempts"></p>
    <button onclick="resetGame()">Reset</button>
  </div>
`

// Глобальные переменные
let secretNumber;
let attempts;
let hintCounter;
const guessInput = document.getElementById("guess");
const message = document.getElementById("message")
const attemptsContainer = document.getElementById("attempts")
const btn = document.getElementById("submit__btn")

// Функция для генерации случайного числа в указанном диапазоне
function generateSecretNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для проверки угаданного числа
function checkGuess() {
    const guess = parseInt(guessInput.value);
    const isRange = guessInput.value.toString().includes("-");

    if (isRange) {

      attempts++;
      attemptsContainer.textContent = `Attempts: ${attempts}`;

      const range = guessInput.value.toString().split("-");
      const min = parseInt(range[0]);
      const max = parseInt(range[1]);

      if (secretNumber >= min && secretNumber <= max) {
          message.textContent = "Yes, the secret number is in the range you provided!";
      } else {
          message.textContent = "No, the secret number is not in the range you provided.";
      }

      if (attempts % 3 === 0 && guess !== secretNumber) {
          hintCounter++;
          oddOrEven(secretNumber)
      }

    } else if (guessInput.value) {

      if (guess < 1 || guess > 100) {
          message.textContent = "Please enter a number between 1 and 100.";
          return;
      }

      attempts++;
      attemptsContainer.textContent = `Attempts: ${attempts}`;

      if (guess === secretNumber) {
          message.textContent = `Congratulations! You guessed the number correctly.`;
          guessInput.disabled = true;
          btn.classList.add("disable")
      } else if (guess < secretNumber) {
          message.textContent = "Try a higher number.";
      } else {
          message.textContent = "Try a lower number.";
      }

      if (attempts % 3 === 0 && guess !== secretNumber) {
          hintCounter++;
          oddOrEven(secretNumber)
      }
    }
}
window.checkGuess = checkGuess

// Функция четное/нечетное
function oddOrEven(secretNumber) {
  if (secretNumber % 2 === 0) {
    message.textContent += " The secret number is even.";
  } else {
    message.textContent += " The secret number is odd.";
  }
}

// Проверяем ввод на соответствие требованиям
function checkInput(val) {
  const regEx = new RegExp("^(?:100|[1-9]?[0-9])$|^(?:100|[1-9]?[0-9])-(?:100|[1-9]?[0-9])$");
  if (regEx.test(val)) {
    if (regEx.test(val) && val.toString().includes('-')) {
      const rez = val.toString().split("-");
      const first = parseInt(rez[0]);
      const second = parseInt(rez[1]);
      second > first ? btn.classList.remove("disable") : '';
    } else {
      btn.classList.remove("disable")
    }
  } else {
    btn.classList.contains("disable") ? '' : btn.classList.add("disable");
  }
}
window.checkInput = checkInput

// Функция для сброса игры
function resetGame() {
    secretNumber = generateSecretNumber(1, 100);
    console.log('num -', secretNumber)
    attempts = 0;
    hintCounter = 0;
    guessInput.value = "";
    message.textContent = "";
    attemptsContainer.textContent = "";
    guessInput.disabled = false;
    btn.classList.contains("disable") ? '' : btn.classList.add("disable");
}
window.resetGame = resetGame

// Инициализация игры при загрузке страницы
window.onload = resetGame;