let fr = 24; // 24 fps
let sqareLength = 12; // change it for bigger squares 
let array;

function setup() {
    let width =  windowWidth - (windowWidth % sqareLength);  
    let height = windowHeight - (windowHeight % sqareLength);
    createCanvas(width, height);
    frameRate(fr);
    array = createArray(width / sqareLength,  height / sqareLength);
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[0].length; j++) {
            array[i][j] = Math.floor(Math.random() * 2);
        }
    }
}

// p5.js draw mehtod
function draw() {
    // azure background
    background('rgb(240, 255, 255)'); 
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[0].length; j++) {
            let x = sqareLength * j;
            let y = sqareLength * i;
            if (array[i][j] == 1)
                fill('rgba(0, 0, 0, .5)'); 
            else 
                fill('rgb(240, 255, 255)'); 
            rect(x, y, sqareLength, sqareLength);
            strokeWeight(.01);

        }
    }

    // generate next generation
    let copyArray = copy2DArray(array);
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[0].length; j++) {
            let numOfAliveNeighbour = getNumOfAlive(i, j, copyArray); 
            // over and underpopulation
            if (numOfAliveNeighbour < 2 || numOfAliveNeighbour > 3) 
                array[i][j] = 0;
            else if (numOfAliveNeighbour == 3) 
                array[i][j] = 1;
        }
    }

}

// create custom array
function createArray(width, height) {
    let array = new Array(height);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(width);
    }
    return array;
}

// copy array
function copy2DArray(array) {
    let copy = new Array(array.length); 
    for (let i = 0; i < array.length; i++) {
        copy[i] = [...array[i]];
    }
    return copy;
}

// return number of alive neighbour of given index 
function getNumOfAlive(i, j, array) {
    let count = 0; 
    // left up corner
    if (i != 0 && j != 0) {
        if (array[i - 1][j - 1] == 1)
            count++;
    }
    // left 
    if (j != 0) {
        if (array[i][j - 1] == 1)
            count++;
    }
    // left down corner
    if (i != array.length - 1 && j != 0) {
        if (array[i + 1][j - 1] == 1)
            count++;
    }
    // down
    if (i != array.length - 1) {
        if (array[i + 1][j] == 1)
            count++;
    }
    // right down corner
    if (i != array.length - 1 && j != array[0].length - 1) {
        if (array[i + 1][j + 1] == 1)
            count++;
    }
    // right
    if (j != array[0].length - 1) {
        if (array[i][j + 1] == 1)
            count++;
    }
    // right up corner
    if (i != 0 && j != array[0].length - 1) {
        if (array[i - 1][j + 1] == 1)
            count++;
    }
    // up
    if (i != 0) {
        if (array[i - 1][j] == 1)
            count++;
    }
    return count;
}
