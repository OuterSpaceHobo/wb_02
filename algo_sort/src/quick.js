import { resetButtons, swapBars } from "./service";
import { isSorting, delay } from "./main";

export async function quickSort(bars, barCount) {

    await quickSortHelper(0, barCount - 1, bars);
    if (isSorting) {
      for (let i = 0; i < barCount; i++) {
        bars[i].style.backgroundColor = "green";
      }
    }
    // isSorting = false;
    resetButtons()
}
  window.quickSort = quickSort


async function quickSortHelper(low, high, bars) {
    if (low < high && isSorting) {
        const pivotIndex = await partition(low, high, bars);
        bars[pivotIndex].style.backgroundColor = "green";
  
        await quickSortHelper(low, pivotIndex - 1, bars);
        await quickSortHelper(pivotIndex + 1, high, bars);
    }
}

async function partition(low, high, bars) {
    const pivot = parseInt(bars[high].style.height);
    let i = low - 1;
  
    for (let j = low; j < high; j++) {
  
        bars[j].style.backgroundColor = "red";
        if (!isSorting) break;
        await new Promise(resolve => setTimeout(resolve, delay));
        const height = parseInt(bars[j].style.height);
  
        if (height < pivot) {
            i++;
            // swapBars(i, j);
            swapBars(i, j, bars);
  
            
        }
        bars[j].style.backgroundColor = "blue";
    }
  
    // swapBars(i + 1, high);
    swapBars(i + 1, high, bars);
  
    return i + 1;
  }