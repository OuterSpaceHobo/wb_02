// Находим и двигаем нужный текст
export function textHittest(x, y, textIndex, texts) {
    const text = texts[textIndex];
    return (
      x >= text.x &&
      x <= text.x + text.width &&
      y >= text.y - text.height &&
      y <= text.y
    );
  }

// Сохранение мема на локальном компьютере
export function saveMeme(canvas) {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "meme.png";
    link.click();
}

// Рисуем и перерисовываем текст
export function draw(ctx, texts, canvas, image) {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  texts.forEach((text) => {
    ctx.fillText(text.text, text.x, text.y);
  });
}

// Включаем кнопки
export function toggleButtons(saveBtn, cleanBtn, resetBtn) {
  saveBtn.classList.contains("disable") ? saveBtn.classList.remove("disable") : '' 
  cleanBtn.classList.contains("disable") ? cleanBtn.classList.remove("disable") : ''
  resetBtn.classList.contains("disable") ? resetBtn.classList.remove("disable") : '';
}

// Выключаем кнопки
export function resetButtons(saveBtn, cleanBtn, resetBtn) {
  saveBtn.classList.contains("disable") ? '' : saveBtn.classList.add("disable") 
  cleanBtn.classList.contains("disable") ? '' : cleanBtn.classList.add("disable")
  resetBtn.classList.contains("disable") ? '' : resetBtn.classList.add("disable")
}

// Выключаем кнопки
export function openSettings() {
  document.getElementById("settings__container").style.display = 'flex'
  document.getElementById("greetings__span").style.display = 'none'
  document.getElementById("img__label").innerText = 'Reupload image'
}


