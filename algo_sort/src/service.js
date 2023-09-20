export function swapBars(i, j, bars) {
    const tempHeight = bars[i].style.height;
    bars[i].style.height = bars[j].style.height;
    bars[j].style.height = tempHeight;
}

export function resetBarsColor(bars) {
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = "blue";
    }
}

export function resetButtons() {
    const genBtn = document.getElementById("generate__btn");
    const startBtn = document.getElementById("start__btn");
    const stopBtn = document.getElementById("stop__btn");
    genBtn.classList.remove('disable')
    startBtn.classList.remove('disable')
    stopBtn.classList.add('disable')
}