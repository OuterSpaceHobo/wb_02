// Рисуем стартовую заглушку под волны 
export function drawLine() {
    const waveform = document.getElementById("waveform");
    const canvas = waveform;
    const canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "#54FB0D";
    canvasContext.beginPath(); 
    canvasContext.moveTo(0, 75); 
    canvasContext.lineTo(300, 75); 
    canvasContext.stroke(); 
  }

// Включаем/выключаем кнопки
export function handleActiveBtns(index) {
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (index > 0) {
      prevBtn.classList.contains("disable") ? prevBtn.classList.remove("disable") : ''
      nextBtn.classList.contains("disable") ? nextBtn.classList.remove("disable") : ''
      if (index >= (playlist.length - 1)) {
        nextBtn.classList.contains("disable") ? '' : nextBtn.classList.add("disable")
      }
    } else {
      prevBtn.classList.add("disable")
      nextBtn.classList.remove("disable")
    }
  }

// Форматирование времени в формат "минуты:секунды"
 export function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

