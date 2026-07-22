/**
 * Sorting Algorithms Generator Engine & Metadata Registry
 */

const ALGO_METADATA = {
    bubbleSort: {
        name: "Bubble Sort",
        category: "Comparison Sort",
        timeBest: "O(n)",
        timeAvg: "O(n²)",
        timeWorst: "O(n²)",
        spaceComplexity: "O(1)",
        stable: "Yes",
        description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Pass continues until no swaps are needed.",
        code: [
            "procedure bubbleSort(A : list of sortable items)",
            "  n := length(A)",
            "  repeat",
            "    swapped := false",
            "    for i := 1 to n-1 do",
            "      if A[i-1] > A[i] then",
            "        swap(A[i-1], A[i])",
            "        swapped := true",
            "    n := n - 1",
            "  until not swapped"
        ]
    },
    selectionSort: {
        name: "Selection Sort",
        category: "Comparison Sort",
        timeBest: "O(n²)",
        timeAvg: "O(n²)",
        timeWorst: "O(n²)",
        spaceComplexity: "O(1)",
        stable: "No",
        description: "Divides the array into a sorted and unsorted region. Repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.",
        code: [
            "procedure selectionSort(A : list of sortable items)",
            "  n := length(A)",
            "  for i := 0 to n-2 do",
            "    minIdx := i",
            "    for j := i+1 to n-1 do",
            "      if A[j] < A[minIdx] then minIdx := j",
            "    if minIdx != i then swap(A[i], A[minIdx])"
        ]
    },
    insertionSort: {
        name: "Insertion Sort",
        category: "Comparison Sort",
        timeBest: "O(n)",
        timeAvg: "O(n²)",
        timeWorst: "O(n²)",
        spaceComplexity: "O(1)",
        stable: "Yes",
        description: "Builds the final sorted array one item at a time. It takes each element and inserts it into its correct position within the already-sorted part of the array.",
        code: [
            "procedure insertionSort(A : list of sortable items)",
            "  for i := 1 to length(A)-1 do",
            "    key := A[i]",
            "    j := i - 1",
            "    while j >= 0 and A[j] > key do",
            "      A[j + 1] := A[j]",
            "      j := j - 1",
            "    A[j + 1] := key"
        ]
    },
    quickSort: {
        name: "Quick Sort (Lomuto)",
        category: "Divide & Conquer",
        timeBest: "O(n log n)",
        timeAvg: "O(n log n)",
        timeWorst: "O(n²)",
        spaceComplexity: "O(log n)",
        stable: "No",
        description: "Picks an element as pivot and partitions the array around the pivot so that elements smaller than pivot go left and larger go right.",
        code: [
            "procedure quickSort(A, low, high)",
            "  if low < high then",
            "    p := partition(A, low, high)",
            "    quickSort(A, low, p - 1)",
            "    quickSort(A, p + 1, high)",
            "",
            "function partition(A, low, high)",
            "  pivot := A[high]",
            "  i := low - 1",
            "  for j := low to high - 1 do",
            "    if A[j] < pivot then",
            "      i := i + 1; swap(A[i], A[j])",
            "  swap(A[i + 1], A[high])",
            "  return i + 1"
        ]
    },
    mergeSort: {
        name: "Merge Sort",
        category: "Divide & Conquer",
        timeBest: "O(n log n)",
        timeAvg: "O(n log n)",
        timeWorst: "O(n log n)",
        spaceComplexity: "O(n)",
        stable: "Yes",
        description: "Recursively divides the array into two halves until single elements remain, then merges the sorted halves back together.",
        code: [
            "procedure mergeSort(A, left, right)",
            "  if left < right then",
            "    mid := (left + right) / 2",
            "    mergeSort(A, left, mid)",
            "    mergeSort(A, mid + 1, right)",
            "    merge(A, left, mid, right)"
        ]
    },
    heapSort: {
        name: "Heap Sort",
        category: "Tree Based",
        timeBest: "O(n log n)",
        timeAvg: "O(n log n)",
        timeWorst: "O(n log n)",
        spaceComplexity: "O(1)",
        stable: "No",
        description: "Converts the array into a Max Heap structure. Repeatedly extracts the maximum root element and places it at the end of the array.",
        code: [
            "procedure heapSort(A)",
            "  buildMaxHeap(A)",
            "  for i := length(A)-1 down to 1 do",
            "    swap(A[0], A[i])",
            "    heapify(A, 0, i)"
        ]
    },
    shellSort: {
        name: "Shell Sort",
        category: "Insertion Variant",
        timeBest: "O(n log n)",
        timeAvg: "O(n^(4/3))",
        timeWorst: "O(n²)",
        spaceComplexity: "O(1)",
        stable: "No",
        description: "Generalization of insertion sort that allows exchanges of elements that are far apart using decreasing gap intervals.",
        code: [
            "procedure shellSort(A)",
            "  n := length(A)",
            "  for gap := n/2 down to 1 step gap/2 do",
            "    for i := gap to n-1 do",
            "      temp := A[i]",
            "      j := i",
            "      while j >= gap and A[j - gap] > temp do",
            "        A[j] := A[j - gap]",
            "        j := j - gap",
            "      A[j] := temp"
        ]
    },
    cocktailSort: {
        name: "Cocktail Shaker Sort",
        category: "Comparison Sort",
        timeBest: "O(n)",
        timeAvg: "O(n²)",
        timeWorst: "O(n²)",
        spaceComplexity: "O(1)",
        stable: "Yes",
        description: "A variation of Bubble Sort that traverses the array in both directions alternately (left-to-right then right-to-left).",
        code: [
            "procedure cocktailSort(A)",
            "  swapped := true; start := 0; end := length(A)-1",
            "  while swapped do",
            "    swapped := false",
            "    for i := start to end-1 do pass forward",
            "    if not swapped then break",
            "    end := end - 1",
            "    for i := end-1 down to start do pass backward",
            "    start := start + 1"
        ]
    },
    radixSort: {
        name: "Radix Sort (LSD)",
        category: "Non-Comparison",
        timeBest: "O(nk)",
        timeAvg: "O(nk)",
        timeWorst: "O(nk)",
        spaceComplexity: "O(n+k)",
        stable: "Yes",
        description: "Sorts numbers digit by digit starting from the least significant digit (LSD) using counting sort as a subroutine.",
        code: [
            "procedure radixSort(A)",
            "  maxVal := getMax(A)",
            "  for exp := 1 to maxVal/exp > 0 step exp*10 do",
            "    countingSortByDigit(A, exp)"
        ]
    }
};

function* bubbleSortGen(arr) {
    let n = arr.length;
    let swapped;
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            yield {
                type: 'compare',
                indices: [j, j + 1],
                msg: `Comparing elements at index ${j} (${Math.round(arr[j])}) and ${j + 1} (${Math.round(arr[j + 1])})`
            };
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
                yield {
                    type: 'swap',
                    indices: [j, j + 1],
                    msg: `Swapped index ${j} and ${j + 1} as ${Math.round(arr[j + 1])} > ${Math.round(arr[j])}`
                };
            }
        }
        yield {
            type: 'markSorted',
            indices: [n - 1 - i],
            msg: `Element at index ${n - 1 - i} is now in its final sorted position`
        };
        if (!swapped) break;
    }
    let allIndices = Array.from({ length: n }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* selectionSortGen(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        yield { type: 'pivot', index: i, msg: `Pass ${i + 1}: Current minimum candidate index is ${i}` };
        for (let j = i + 1; j < n; j++) {
            yield {
                type: 'compare',
                indices: [minIdx, j],
                msg: `Comparing candidate min index ${minIdx} (${Math.round(arr[minIdx])}) with index ${j} (${Math.round(arr[j])})`
            };
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                yield { type: 'pivot', index: minIdx, msg: `New minimum candidate found at index ${minIdx} (${Math.round(arr[minIdx])})` };
            }
        }
        if (minIdx !== i) {
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
            yield { type: 'swap', indices: [i, minIdx], msg: `Swapped minimum element into sorted position ${i}` };
        }
        yield { type: 'markSorted', indices: [i], msg: `Index ${i} sorted` };
    }
    let allIndices = Array.from({ length: n }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* insertionSortGen(arr) {
    let n = arr.length;
    yield { type: 'markSorted', indices: [0], msg: 'Index 0 initially sorted' };
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        yield { type: 'pivot', index: i, msg: `Inserting key ${Math.round(key)} from index ${i}` };
        
        while (j >= 0) {
            yield { type: 'compare', indices: [j, j + 1], msg: `Comparing ${Math.round(arr[j])} with key ${Math.round(key)}` };
            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                yield { type: 'overwrite', index: j + 1, value: arr[j], msg: `Shifted element at index ${j} to ${j + 1}` };
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        yield { type: 'overwrite', index: j + 1, value: key, msg: `Inserted key into position ${j + 1}` };
    }
    let allIndices = Array.from({ length: n }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* quickSortGen(arr) {
    yield* _quickSortHelper(arr, 0, arr.length - 1);
    let allIndices = Array.from({ length: arr.length }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* _quickSortHelper(arr, low, high) {
    if (low < high) {
        let pivotGen = _partitionLomutoGen(arr, low, high);
        let result = pivotGen.next();
        while (!result.done) {
            yield result.value;
            result = pivotGen.next();
        }
        let p = result.value;
        yield { type: 'markSorted', indices: [p], msg: `Pivot at index ${p} locked in sorted position` };

        yield* _quickSortHelper(arr, low, p - 1);
        yield* _quickSortHelper(arr, p + 1, high);
    } else if (low === high) {
        yield { type: 'markSorted', indices: [low], msg: `Single element sub-array at index ${low} sorted` };
    }
}

function* _partitionLomutoGen(arr, low, high) {
    let pivot = arr[high];
    yield { type: 'pivot', index: high, msg: `Selected pivot ${Math.round(pivot)} at index ${high}` };
    let i = low - 1;

    for (let j = low; j < high; j++) {
        yield { type: 'compare', indices: [j, high], msg: `Comparing index ${j} (${Math.round(arr[j])}) with pivot (${Math.round(pivot)})` };
        if (arr[j] < pivot) {
            i++;
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            yield { type: 'swap', indices: [i, j], msg: `Swapped element ${Math.round(arr[i])} into left partition` };
        }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    yield { type: 'swap', indices: [i + 1, high], msg: `Placed pivot at final partition index ${i + 1}` };
    return i + 1;
}

function* mergeSortGen(arr) {
    yield* _mergeSortHelper(arr, 0, arr.length - 1);
    let allIndices = Array.from({ length: arr.length }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* _mergeSortHelper(arr, l, r) {
    if (l < r) {
        let m = Math.floor(l + (r - l) / 2);
        yield* _mergeSortHelper(arr, l, m);
        yield* _mergeSortHelper(arr, m + 1, r);
        yield* _mergeGen(arr, l, m, r);
    }
}

function* _mergeGen(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        yield { type: 'compare', indices: [l + i, m + 1 + j], msg: `Merging: Comparing ${Math.round(L[i])} and ${Math.round(R[j])}` };
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            yield { type: 'overwrite', index: k, value: L[i], msg: `Placed ${Math.round(L[i])} at index ${k}` };
            i++;
        } else {
            arr[k] = R[j];
            yield { type: 'overwrite', index: k, value: R[j], msg: `Placed ${Math.round(R[j])} at index ${k}` };
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        yield { type: 'overwrite', index: k, value: L[i], msg: `Copying remaining left element ${Math.round(L[i])} to index ${k}` };
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        yield { type: 'overwrite', index: k, value: R[j], msg: `Copying remaining right element ${Math.round(R[j])} to index ${k}` };
        j++;
        k++;
    }
}

function* heapSortGen(arr) {
    let n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* _heapifyGen(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        let temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        yield { type: 'swap', indices: [0, i], msg: `Extracted max heap root to index ${i}` };
        yield { type: 'markSorted', indices: [i], msg: `Index ${i} sorted` };
        yield* _heapifyGen(arr, i, 0);
    }
    let allIndices = Array.from({ length: n }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* _heapifyGen(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
        yield { type: 'compare', indices: [l, largest], msg: `Heapify: Comparing left child ${l} with largest ${largest}` };
        if (arr[l] > arr[largest]) largest = l;
    }

    if (r < n) {
        yield { type: 'compare', indices: [r, largest], msg: `Heapify: Comparing right child ${r} with largest ${largest}` };
        if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
        let swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        yield { type: 'swap', indices: [i, largest], msg: `Heapify: Swapped parent ${i} with child ${largest}` };
        yield* _heapifyGen(arr, n, largest);
    }
}

function* shellSortGen(arr) {
    let n = arr.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        yield { type: 'pivot', index: 0, msg: `Using gap interval = ${gap}` };
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j = i;
            while (j >= gap) {
                yield { type: 'compare', indices: [j - gap, j], msg: `Shell Sort: Comparing index ${j - gap} and ${j} with gap ${gap}` };
                if (arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    yield { type: 'overwrite', index: j, value: arr[j - gap], msg: `Shifted element across gap to index ${j}` };
                    j -= gap;
                } else {
                    break;
                }
            }
            arr[j] = temp;
            yield { type: 'overwrite', index: j, value: temp, msg: `Placed element at gap index ${j}` };
        }
    }
    let allIndices = Array.from({ length: n }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* cocktailSortGen(arr) {
    let swapped = true;
    let start = 0;
    let end = arr.length - 1;

    while (swapped) {
        swapped = false;
        for (let i = start; i < end; i++) {
            yield { type: 'compare', indices: [i, i + 1], msg: `Cocktail Forward: Comparing index ${i} and ${i + 1}` };
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
                yield { type: 'swap', indices: [i, i + 1], msg: `Cocktail Forward: Swapped ${i} and ${i + 1}` };
            }
        }
        if (!swapped) break;
        yield { type: 'markSorted', indices: [end], msg: `End index ${end} in sorted place` };
        end--;
        swapped = false;

        for (let i = end - 1; i >= start; i--) {
            yield { type: 'compare', indices: [i, i + 1], msg: `Cocktail Backward: Comparing index ${i} and ${i + 1}` };
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
                yield { type: 'swap', indices: [i, i + 1], msg: `Cocktail Backward: Swapped ${i} and ${i + 1}` };
            }
        }
        yield { type: 'markSorted', indices: [start], msg: `Start index ${start} in sorted place` };
        start++;
    }
    let allIndices = Array.from({ length: arr.length }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

function* radixSortGen(arr) {
    let n = arr.length;
    let maxVal = Math.max(...arr);

    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
        yield { type: 'pivot', index: 0, msg: `Radix Sort: Processing digit place ${exp}` };
        let output = new Array(n).fill(0);
        let count = new Array(10).fill(0);

        for (let i = 0; i < n; i++) {
            let digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            yield { type: 'compare', indices: [i, i], msg: `Digit ${digit} counted for element ${Math.round(arr[i])}` };
        }

        for (let i = 1; i < 10; i++) count[i] += count[i - 1];

        for (let i = n - 1; i >= 0; i--) {
            let digit = Math.floor(arr[i] / exp) % 10;
            let targetIdx = count[digit] - 1;
            output[targetIdx] = arr[i];
            count[digit]--;
        }

        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
            yield { type: 'overwrite', index: i, value: output[i], msg: `Placed ${Math.round(output[i])} according to digit place ${exp}` };
        }
    }
    let allIndices = Array.from({ length: n }, (_, k) => k);
    yield { type: 'markSorted', indices: allIndices, msg: 'Sorting complete!' };
}

const ALGO_GENERATORS = {
    bubbleSort: bubbleSortGen,
    selectionSort: selectionSortGen,
    insertionSort: insertionSortGen,
    quickSort: quickSortGen,
    mergeSort: mergeSortGen,
    heapSort: heapSortGen,
    shellSort: shellSortGen,
    cocktailSort: cocktailSortGen,
    radixSort: radixSortGen
};
