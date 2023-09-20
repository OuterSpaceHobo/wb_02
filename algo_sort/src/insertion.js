import { resetButtons } from "./service";
import { isSorting } from "./main";

export async function insertionSort(bars, delay) {
    for (let i = 1; i < bars.length; i++) {
        const key = parseInt(bars[i].style.height);
        let j = i - 1
        bars[i].style.backgroundColor = "red";
        if (!isSorting) break;
        
        await new Promise(resolve => setTimeout(resolve, delay));
  
        while (j >= 0 && parseInt(bars[j].style.height) > key) {
            if (!isSorting) break;
            bars[j].style.backgroundColor = "red";
            bars[j + 1].style.height = bars[j].style.height;
            j--;
  
            await new Promise(resolve => setTimeout(resolve, delay));
  
            for (let k = i; k > j + 1; k--) {
                bars[k].style.backgroundColor = "blue";
            }
        }
        bars[j + 1].style.height = `${key}px`;
  
        if (isSorting) {
          for (let k = i; k >= 0; k--) {
            bars[k].style.backgroundColor = "green";
          }
        }
    }
    // isSorting = false;
    resetButtons()
  }
  window.insertionSort = insertionSort