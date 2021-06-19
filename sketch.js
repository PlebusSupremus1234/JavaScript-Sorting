let array, initial, sorted;

let spacing;
let paused = true;
let done = false;

let settings = {
    showCurrBars: true,
    showBarColors: false
};

let currBars = [];
let frames = [];

let comparisons = 0;
let i = 0;
let j = 0;
let m = 0;

function setup() {
    createCanvas(1200 + 450, 800);
    colorMode(HSB);
    init({ type: "bubble", newA: true, length: 240 });
}

/*
    Todo:
    - Correct Merge Sort Comparisons
    - Further optimise quicksort
    - Fix timing for sorts
    - Add quick sort
*/

function draw() {
    background("#ebebeb");
    noStroke();

    if (!paused && !done) {
        let element = document.getElementById("slider");
        for (let a = 0; a < Math.ceil((element.value ** 2) / 15); a++) {
            if (sort === "bubble") {
                if (j >= i) {
                    if (i < 1) continue;
                    i--;
                    j = 0;
                }
                if (array[j] > array[j + 1]) [array[j], array[j + 1]] = [array[j + 1], array[j]];
                currBars = [j + 1];
                comparisons++;
                j++;
            } else if (sort === "selection") {
                if (j >= array.length) {
                    if (i >= array.length - 1) continue;
                    [array[m], array[i]] = [array[i], array[m]];
                    i++;
                    m = i;
                    j = i + 1;
                }
                if (array[j] < array[m]) m = j;
                currBars = [m, j];
                comparisons++;
                j++;
            } else if (sort === "insertion") {
                if (j >= i) {
                    if (i >= array.length - 1) continue;
                    i++;
                    j = 0;
                }
                if (array[i] < array[j]) [array[i], array[j]] = [array[j], array[i]];
                currBars = [j];
                comparisons++;
                j++;
            } else if (sort === "merge") {
                if (a % 15 === 0) {
                    if (i >= frames.length) {
                        if (m[j] && m[j + 1]) {
                            let left = m[j].slice();    
                            let right = m[j + 1].slice();
                            let joined = left.concat(right);
                            let flattened = m.flat();
                            let start = flattened.indexOf(joined[0]);
                            for (let k = 0; k < joined.length; k++) frames.push([[start + k], ...flattened]);
                            let s = [];
                            while (left.length > 0 && right.length > 0) s.push(left[0] < right[0] ? left.shift() : right.shift());
                            s = [...s, ...left, ...right];
                            m[j] = [...m[j], ...m[j + 1]];
                            m.splice(j + 1, 1);
                            start = m.flat().indexOf(s[0]);
                            for (let k = 0; k < s.length; k++) {
                                m[j][k] = s[k];
                                frames.push([[start + k], ...m.flat()]);
                            }
                        }
                        j++;
                        if (j >= m.length) j = 0;
                    }
                    if (frames[i]) {
                        array = frames[i].slice(1);
                        currBars = frames[i][0];
                        i++;
                    }
                }
            } else if (sort === "quick") {
                if (a % 15 === 0) {
                    if (i >= frames.length) {
                        if (array.length < 300) continue;
                        else {
                            if (j.length > 0) {
                                let l = frames.length;
                                while (l === frames.length && j[0]) {
                                    let coords = QuickSort([].concat(array), j[0][0][0], j[0][0][1], false);
                                    j[0].splice(0, 1);
                                    if (j[0].length === 0) j.splice(0, 1);
                                    if (coords) j.splice(0, 0, coords);
                                }
                            }
                        }
                    }

                    if (i < frames.length) {
                        array = frames[i].slice(1);
                        comparisons += frames[i][0][0];
                        i++;
                    }
                }
            }
        }
        if (isEqual(array, sorted)) {
            currBars = [0];
            done = true;
        }
    }

    if (done && currBars[0] < array.length - 1) {
        currBars[0] += 8;
        if (currBars[0] >= array.length - 1 && !paused) toggle(1);
    }

    fill(0);
    rect(0, 0, 1200, 800);
    if (array.length < 450) stroke(0);
    for (let i = 0; i < array.length; i++) {
        let color = settings.showCurrBars && currBars.includes(i) ? [0, 100, 100] : (settings.showBarColors ? [(330 * array[i] / array.length) + 0 - 30, 100, 100] : [0, 0, 100]);
        fill(...color);
        rect(i * 1200 / array.length, height - array[i] * spacing, 1200 / array.length, array[i] * spacing);
    }

    document.getElementById("header").innerHTML = `${sort.charAt(0).toUpperCase() + sort.slice(1)} Sort - ${comparisons} Comparisons - Made by Plebus Supremus`;

    noStroke();
    fill(0);
    textSize(40);
    textStyle(BOLD);
    text("Visualized Sorting", 1215, 50);
    textSize(30);
    text("Play or Pause:", 1215, 90);
    text("Restart:", 1215, 130);
    text("Speed:", 1215, 170);
    text("Sorting Method:", 1215, 210);
}