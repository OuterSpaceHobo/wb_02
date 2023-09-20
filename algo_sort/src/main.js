import '../style.css'
import { resetBarsColor, resetButtons } from './service';
import { bubbleSort } from './bubble';
import { selectionSort } from './selection';
import { insertionSort } from './insertion';
import { quickSort } from './quick';
import { mergeSort } from './merge';

document.querySelector('#app').innerHTML = `
  <div>
  <h1>Sorting Algorithms Visualization</h1>
  <div style="margin-bottom: 10px;">
      <label for="arraySize">Array Size:</label>
      <input type="number" id="arraySize" min="5" max="100" value="25">
      <button id="generate__btn" onclick="generateArray()">Generate Array</button>
      <br>
      <label for="algorithm">Sorting Algorithm:</label>
      <select id="algorithm">
          <option value="bubbleSort">Bubble</option>
          <option value="selectionSort">Selection</option>
          <option value="insertionSort">Insertion</option>
          <option value="quickSort">Quick</option>
          <option value="mergeSort">Merge</option>
      </select>
      <button id="start__btn" onclick="startSorting()">Start Sorting</button>
      <button id="stop__btn" class="disable" onclick="stopSorting()">Stop Sorting</button>
  </div>
  <div id="barsContainer"></div>
  </div>
`

const container = document.getElementById("barsContainer");
const arraySizeInput = document.getElementById("arraySize");
const algorithmSelect = document.getElementById("algorithm");
const genBtn = document.getElementById("generate__btn");
const startBtn = document.getElementById("start__btn");
const stopBtn = document.getElementById("stop__btn");

export const delay = 100;
export let bars = [];
export let isSorting = false;
export let barCount = 0;
export let currentAlgorithm;

function createBars() {
    const arraySize = parseInt(arraySizeInput.value);

    for (let i = 0; i < arraySize; i++) {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${Math.floor(Math.random() * 200) + 20}px`;
        bars.push(bar);
        container.appendChild(bar);
    }
    barCount = bars.length
    console.log(barCount)
}

async function generateArray() {
  bars = [];
  container.innerHTML = "";
  createBars();
}
window.generateArray = generateArray

async function startSorting() {
  genBtn.classList.add('disable')
  startBtn.classList.add('disable')
  stopBtn.classList.remove('disable')

  resetBarsColor(bars)

  if (isSorting) return;
  isSorting = true;

  const selectedAlgorithm = algorithmSelect.value;

  switch (selectedAlgorithm) {
      case "bubbleSort":
          currentAlgorithm = bubbleSort(bars, delay);
          break;
      case "selectionSort":
          currentAlgorithm = selectionSort(bars, delay);
          break;
      case "insertionSort":
          currentAlgorithm = insertionSort(bars, delay)
          break;
      case "quickSort":
          currentAlgorithm = quickSort(bars, barCount)
          break;
      case "mergeSort":
          currentAlgorithm = mergeSort(bars, barCount, delay);
          break;
      default:
          break;
  }
  await currentAlgorithm;
  isSorting = false;
}
window.startSorting = startSorting

function stopSorting() {
  if (currentAlgorithm && typeof currentAlgorithm.return === "function") {
      currentAlgorithm.return();
  }
  isSorting = false;
  resetButtons()
}
window.stopSorting = stopSorting

async function reset() {
  bars = [];
  container.innerHTML = "";
  createBars();
}
window.reset = reset

createBars();