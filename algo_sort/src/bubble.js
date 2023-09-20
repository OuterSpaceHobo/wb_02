import { resetButtons, swapBars } from "./service";
import { isSorting } from "./main";

export async function bubbleSort(bars, delay) {
    for (let i = 0; i < bars.length - 1; i++) {
      if (!isSorting) break;

      for (let j = 0; j < bars.length - i - 1; j++) {
          bars[j].style.backgroundColor = "red";
          bars[j + 1].style.backgroundColor = "red";

            if (!isSorting) break; 
            await new Promise(resolve => setTimeout(resolve, delay));
            const height1 = parseInt(bars[j].style.height);
            const height2 = parseInt(bars[j + 1].style.height);
  
            if (height1 > height2) {
                // swapBars(j, j + 1);
                swapBars(j, j + 1, bars);

            }

            bars[j].style.backgroundColor = "blue";
            bars[j + 1].style.backgroundColor = "blue";
      }
      let rez = bars[bars.length - i - 1]
      isSorting ? rez.style.backgroundColor = "green" : rez.style.backgroundColor = "blue" 
    }
    isSorting ? bars[0].style.backgroundColor = "green" : bars[0].style.backgroundColor = "blue"
    resetButtons()
  }
window.bubbleSort = bubbleSort