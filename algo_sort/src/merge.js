import { resetButtons } from "./service";
import { isSorting } from "./main";

export async function mergeSort(bars, barCount, delay) {
    await mergeSortHelper(0, barCount - 1, delay, bars);
    if (isSorting) {
      for (let i = 0; i < barCount; i++) {
        bars[i].style.backgroundColor = "green";
      }
    }
    // isSorting = false;
    resetButtons()
  }
  window.mergeSort = mergeSort

async function mergeSortHelper(low, high, delay, bars) {
    if (low < high && isSorting) {
        const mid = Math.floor((low + high) / 2);
  
        await mergeSortHelper(low, mid, delay, bars);
        await mergeSortHelper(mid + 1, high, delay, bars);
        await merge(low, mid, high, delay, bars);
    }
}

async function merge(low, mid, high, delay, bars) {
    const tempBars = [];
    let i = low;
    let j = mid + 1;
    let k = 0;
  
    while (i <= mid && j <= high) {
        const height1 = parseInt(bars[i].style.height);
        const height2 = parseInt(bars[j].style.height);
  
        if (height1 < height2) {
            tempBars[k] = bars[i].style.height;
            i++;
        } else {
            tempBars[k] = bars[j].style.height;
            j++;
        }
  
        k++;
    }
    while (i <= mid) {
      tempBars[k] = bars[i].style.height;
      i++;
      k++;
    }
    while (j <= high) {
      tempBars[k] = bars[j].style.height;
      j++;
      k++;
    } 
  
  for (let x = low, y = 0; x <= high; x++, y++) {
      bars[x].style.height = tempBars[y];
      bars[x].style.backgroundColor = "green";
  
      if (!isSorting) break;
      await new Promise(resolve => setTimeout(resolve, delay));
  }
}