import '../style.css'
import { textHittest, saveMeme, draw, resetButtons, toggleButtons, openSettings } from './service';

document.querySelector('#app').innerHTML = `
  <h1>SpaceHobo's awesome meme__gen</h1>

  <div class="main__container">
    <canvas id="canvas" width=500 height=500></canvas>
    <div class="side__container">
    
      <div class=begin__container>
        <span id="greetings__span">Well hello there, upload some image to begin.</span>
        <div class="input_container">
          <label id="img__label" class="pic__label" for="imageUpload" class="btn">Upload image</label>
          <input id="imageUpload" style="display: none;" accept="image/*" type="file">
        </div>
      </div>

      <div id="settings__container" class="settings__container"> 
        <span>Add some text, style it via settings and drag it with mouse.</span>
        <div class="settings__div">
          <input id="theText" oninput="handleTextInput(value)" type="text">
          <button id="submit" class="disable">Add text</button>
        </div>

        <div class="text__settings__div">
          <div class="text__settings__div">
            <label for="textFont">font:</label>
            <select class="text__select" id="textFont" onchange="handleTextFont(value)" >
              <option disabled="disabled" selected="selected">Select an option.</option>
              <option selected value="Verdana" style="font-family: Verdana">Verdana</option>
              <option value="Tahoma" style="font-family: Tahoma">Tahoma</option>
              <option value="Arial" style="font-family: Arial Black,Gadget,sans-serif">Arial</option>
            </select>
          </div>
          <div class="text__settings__div">
            <label for="textColor">color: </label>
            <input type="color" id="textColor" value="#000000" oninput="handleTextColor(value)" />
          </div>
          <div class="text__settings__div">
            <label for="textSize">size:</label>
            <input class="text__input" type="number" id="textSize" value="20" max="100" onchange="handleTextSize(value)" />
          </div>
        </div>

        <div class="settings__div">
          <input class="css-checkbox" type="checkbox" id="bold" name="bold" onclick="toggleBold()" />
          <label for="bold">bold</label>
          <input class="css-checkbox" type="checkbox" id="italic" name="italic" onclick="toggleItalic()" />
          <label for="italic">Italic</label>
        </div>

        <div class="settings__div" id="clean__reset">
          <button id="cleanButton" class="disable" onclick="handleCleanLastText()">Clean last text</button>
          <button id="resetButton" class="disable" onclick="handleCleanAllText()">Reset</button>
        </div>

        <div class="settings__div">
          <button id="saveButton" class="disable">Save meme</button>
        </div>
      </div>
    </div>
  </div>
`

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("saveButton")
const cleanBtn = document.getElementById("cleanButton")
const resetBtn = document.getElementById("resetButton")
const submitBtn = document.getElementById("submit")
const imageUploader = document.getElementById("imageUpload")

let offsetX = canvas.offsetLeft;
let offsetY = canvas.offsetTop;
let startX;
let startY;
let selectedText = -1;
let image;
let boxHeight = 20;
let font = 'verdana';
let thickness = 'normal';
let fontSize = '20';
let fontStyle = 'normal';
const texts = [];

// Загрузка изображения
imageUploader.onchange = function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    image = new Image();
    image.onload = function () {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
  // Открываем настройки
  openSettings()
};

// Проверяем ввод текста 
function handleTextInput(val) {
  if (val) {
    submitBtn.classList.remove("disable");
  } else {
    submitBtn.classList.contains("disable") ? '' : submitBtn.classList.add("disable");
  }
}
window.handleTextInput = handleTextInput

// Стилизация текста
function handleTextColor(val) {
  ctx.fillStyle = `${val}`
  draw(ctx, texts, canvas, image)
}
window.handleTextColor = handleTextColor

function handleTextSize(val) {
  ctx.font = `${fontStyle} ${thickness} ${val}px ${font}`;
  fontSize = `${val}`
  boxHeight = val;
  draw(ctx, texts, canvas, image)
}
window.handleTextSize = handleTextSize

function handleTextFont(val) {
  ctx.font = `${fontStyle} ${thickness} ${fontSize}px ${val}`;
  font = `${val.toLowerCase()}`
  draw(ctx, texts, canvas, image)
}
window.handleTextFont = handleTextFont

function handleCleanLastText() {
  texts.pop()
  if (texts.length === 0) {
    resetButtons(saveBtn, cleanBtn, resetBtn)
  }
  draw(ctx, texts, canvas, image)
}
window.handleCleanLastText = handleCleanLastText

function handleCleanAllText() {
  texts.length = 0
  resetButtons(saveBtn, cleanBtn, resetBtn)
  draw(ctx, texts, canvas, image)
}
window.handleCleanAllText = handleCleanAllText

function toggleItalic() {
  {fontStyle === 'normal' ? fontStyle = 'italic' : fontStyle = 'normal'}
  ctx.font = `${fontStyle} ${thickness} ${fontSize}px ${font}`;
  draw(ctx, texts, canvas, image)
}
window.toggleItalic = toggleItalic

function toggleBold() {
  {thickness === 'bold' ? thickness = 'normal' : thickness = 'bold'}
  ctx.font = `${fontStyle} ${thickness} ${fontSize}px ${font}`;
  draw(ctx, texts, canvas, image)
}
window.toggleBold = toggleBold

// Создаем и добавляем события мыши для перетаскивания текста
function handleMouseDown(e) {
  e.preventDefault();
  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);
  for (let i = 0; i < texts.length; i++) {
    if (textHittest(startX, startY, i, texts)) {
      selectedText = i;
    }
  }
}

function handleMouseUp(e) {
  e.preventDefault();
  selectedText = -1;
}

function handleMouseOut(e) {
  e.preventDefault();
  selectedText = -1;
}

function handleMouseMove(e) {
  if (selectedText < 0) {
    return;
  }
  e.preventDefault();
  const mouseX = parseInt(e.clientX - offsetX);
  const mouseY = parseInt(e.clientY - offsetY);

  const dx = mouseX - startX;
  const dy = mouseY - startY;
  startX = mouseX;
  startY = mouseY;

  const text = texts[selectedText];
  text.x += dx;
  text.y += dy;
  draw(ctx, texts, canvas, image)
}

canvas.onmousedown = function (e) { handleMouseDown(e) };
canvas.onmousemove = function (e) { handleMouseMove(e) };
canvas.onmouseup = function (e) { handleMouseUp(e) };
canvas.onmouseout = function (e) { handleMouseOut(e) };

// Отдаем новый текст на отрисовку
submitBtn.onclick = function() {
  const y = texts.length * 20 + 20;
  const inputText = document.getElementById("theText").value; 

  const text = { text: inputText, x: 20, y };
  ctx.font = `${fontStyle} ${thickness} ${fontSize}px ${font}`;
  text.width = ctx.measureText(text.text).width;
  text.height = boxHeight;
  texts.push(text);

  draw(ctx, texts, canvas, image)
  toggleButtons(saveBtn, cleanBtn, resetBtn)
};

// Сохранение мема на локальном компьютере
saveBtn.onclick = function() {
    saveMeme(canvas)
};









  







