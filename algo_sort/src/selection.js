import { resetButtons, swapBars } from "./service";
import { isSorting } from "./main";

export async function selectionSort(bars, delay) {
    for (let i = 0; i < bars.length - 1; i++) {
        let minIndex = i;
        bars[i].style.backgroundColor = "red";
        if (!isSorting) break;
  
        for (let j = i + 1; j < bars.length; j++) {
            if (!isSorting) break;
  
            bars[j].style.backgroundColor = "red";
            await new Promise(resolve => setTimeout(resolve, delay));
  
            const height1 = parseInt(bars[minIndex].style.height);
            const height2 = parseInt(bars[j].style.height);
  
            if (height2 < height1) {
                bars[minIndex].style.backgroundColor = "blue";
                minIndex = j;
                bars[minIndex].style.backgroundColor = "red";
            } else {
                bars[j].style.backgroundColor = "blue";
            }
        }
        // swapBars(i, minIndex);
        swapBars(i, minIndex, bars);
        bars[minIndex].style.backgroundColor = "blue";
        bars[i].style.backgroundColor = "green";
    }
    let rez = bars[bars.length - 1]
    isSorting ? rez.style.backgroundColor = "green" : rez.style.backgroundColor = "blue"
    resetButtons()
  }
  window.selectionSort = selectionSort