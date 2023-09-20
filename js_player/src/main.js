import '../style.css'
import { loadPlaylist } from './localStorage';
import { drawLine, handleActiveBtns, formatTime } from './service';
import { forwardIcon, backwardIcon, playIcon, pauseIcon } from './icons';

document.querySelector('#app').innerHTML = `
  <div class="player__container" style="position: relative;">
    <h1>Music Player</h1>
    <div id="player">
        <div id="controls">
          <select class="track__select" id="playlist" onchange="stopPlayback(value)"></select>
          <input type="range" id="volumeBar" min="0" max="1" step="0.1" value="1">
        </div>
        <div id="controls">
            <button id="prevBtn" class="disable" onclick="playPrevTrack()">${backwardIcon}</button>
            <button id="playPauseButton">${playIcon} </button>
            <button id="nextBtn" onclick="playNextTrack()">${forwardIcon}</button>
        </div>
        <div id="controls">
          <span id="currentTime">0:00</span> 
            <input type="range" id="seekBar" min="0" value="0">
          <span id="totalDuration">0:00</span>
        </div>
        <div class="canvas__container">
          <audio id="audioPlayer" onended="playNextTrack()"></audio>
          <canvas id="waveform"></canvas>
        </div>
    </div>
  </div>
`

const audioPlayer = document.getElementById("audioPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const currentTime = document.getElementById("currentTime");
const totalDuration = document.getElementById("totalDuration");
const playlist = document.getElementById("playlist");
const waveform = document.getElementById("waveform");

let isPlaying = false;
let currentTrack = null;
let currentTrackIndex = 0;
let audioContext = null;
let sourceNode = null;
let analyserNode = null;
let animationFrameId = null;
let pausedTime = 0;

// Инициализация аудио-контекста и анализатора
function initAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
}

// Предзагрузка трека
function loadTrack(ind) {
  // Если есть ind - значит переключаем трек в плейлисте
  if (ind === 0 || ind) {
    playlist.selectedIndex = ind
    // Включаем/выключаем кнопки
    handleActiveBtns(ind)
  }
  // Если int нет - создаем трек
  let val = playlist.options[playlist.selectedIndex].value;
  let index = playlist.selectedIndex
  // Включаем/выключаем кнопки
  handleActiveBtns(index)
  currentTrack = new Audio(val);
  audioPlayer.src = val;
  drawLine() // рисуем заглушку

  currentTrack.onloadedmetadata = function() {
    totalDuration.textContent = formatTime(currentTrack.duration);
    seekBar.max = currentTrack.duration;
  };
}

// Воспроизведение трека
function playPlayback() {
  if (!isPlaying) {
    // Проверка первого запуска
    checkFirstPlay()
    if (pausedTime > 0) {
      // Восстановление позиции воспроизведения
      audioPlayer.currentTime = pausedTime;
    }
    audioPlayer.play();
    isPlaying = true;
    playPauseButton.innerHTML = pauseIcon;
    // Включение анимации
    drawWaveform();
  }
}

// Проверка первого запуска
function checkFirstPlay() {
  if (pausedTime === 0 && !sourceNode) {
    // Инициализация аудио-контекста / Создание аудио-источника и подключение анализатора
    console.log('first play')
    initAudioContext();
    sourceNode = audioContext.createMediaElementSource(audioPlayer);
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
  }
}

// Пауза воспроизведения
function pausePlayback() {
  // Сохранение текущей позиции воспроизведения
  pausedTime = audioPlayer.currentTime;
  // Останавливаем воспроизведение
  isPlaying = false;
  playPauseButton.innerHTML = playIcon;
  audioPlayer.pause();
  // Приостановка анимации
  cancelAnimationFrame(animationFrameId);
}

// Остановка воспроизведения
function stopPlayback(value) {
  console.log('val', value)
  pausedTime = 0;
  audioPlayer.currentTime = pausedTime;
  isPlaying = false;
  audioPlayer.pause();
  // Приостановка анимации
  cancelAnimationFrame(animationFrameId);
  playPauseButton.innerHTML = playIcon;
  // Подгружаем превью
  loadTrack()
}
window.stopPlayback = stopPlayback

function playNextTrack() {
  // Проверка первого запуска
  checkFirstPlay()
  // Сверяем индекс
  currentTrackIndex = playlist.selectedIndex
  if (currentTrackIndex < (playlist.length - 1)) {
    currentTrackIndex++;
    // Подгружаем превью и запускаем трек
    loadTrack(currentTrackIndex)
    const track = playlist[currentTrackIndex];
    audioPlayer.src = track.value;
    audioPlayer.play();
    isPlaying = true;
    playPauseButton.innerHTML = pauseIcon;
    // Включение анимации
    drawWaveform();
  } else {
    // Если достигнут конец плейлиста, сбрасываем индекс
    currentTrackIndex = 0;
    audioPlayer.pause();
    isPlaying = false;
    // Подгружаем превью
    loadTrack(currentTrackIndex)
    const track = playlist[currentTrackIndex];
    audioPlayer.src = track.value;
    playPauseButton.innerHTML = playIcon;
  }
}
window.playNextTrack = playNextTrack

function playPrevTrack() {
  // Проверка первого запуска
  checkFirstPlay()
  // Сверяем индекс
  currentTrackIndex = playlist.selectedIndex
  if (currentTrackIndex < (playlist.length)) {
    currentTrackIndex--;
    // Подгружаем превью и запускаем трек
    loadTrack(currentTrackIndex)
    const track = playlist[currentTrackIndex];
    audioPlayer.src = track.value;
    audioPlayer.play();
    isPlaying = true;
    playPauseButton.innerHTML = pauseIcon;
    // Включение анимации
    drawWaveform();
  } else {
    // Если достигнут конец плейлиста, сбрасываем индекс
    currentTrackIndex = 0;
    isPlaying = false;
    audioPlayer.pause();
  }
}
window.playPrevTrack = playPrevTrack

// Обновление времени воспроизведения
function updateCurrentTime() {
  currentTime.textContent = formatTime(audioPlayer.currentTime);
  seekBar.value = audioPlayer.currentTime;
}

// Отрисовка волн на основе анализатора
function drawWaveform() {
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyserNode.getByteTimeDomainData(dataArray);

  const canvas = waveform;
  const canvasContext = canvas.getContext("2d");
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.lineWidth = 2;
  canvasContext.strokeStyle = "#54FB0D";
  canvasContext.beginPath();

  const sliceWidth = canvas.width * 1.0 / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * canvas.height / 2;

      if (i === 0) {
          canvasContext.moveTo(x, y);
      } else {
          canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
  }

  canvasContext.lineTo(canvas.width, canvas.height / 2);
  canvasContext.stroke();

  if (isPlaying) {
    animationFrameId = requestAnimationFrame(drawWaveform);
  }
}

// Обработчик события нажатия на кнопку воспроизведения/паузы
playPauseButton.onclick = function() {
  if (isPlaying) {
      pausePlayback();
  } else {
      loadTrack()
      playPlayback()
  }
};

// Обработчик события изменения положения ползунка перемотки
seekBar.oninput = function() {
  if (!isPlaying) {
    console.log('pause rewind')
    // Создаем контекст и аналазатор, если перемотка на паузе или до первого включения 
    checkFirstPlay()
    audioPlayer.currentTime = seekBar.value;
    pausedTime = audioPlayer.currentTime;
    updateCurrentTime();
  } else {
    audioPlayer.currentTime = seekBar.value;
    updateCurrentTime();
  }
};

// Обработчик события изменения громкости
volumeBar.oninput = function() {
  audioPlayer.volume = volumeBar.value;
}

// Обработчик события времени воспроизведения
audioPlayer.ontimeupdate = function() {
  updateCurrentTime();
}

// Загрузка плейлиста при загрузке страницы
window.onload = function() {
  loadPlaylist();
  loadTrack();
}