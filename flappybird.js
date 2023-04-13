// board
let board; // setting a variable
let boardWidth = 360;
let boardHeight = 640;
let context; // setting a variable

// bird
let birdWidth = 34; 
let birdHeight = 24;

// to get the bird spawning a certain location of the board
let birdX = boardWidth/8; // x-axis (1/8)
let birdY = boardHeight/2; // y-axis (1/2)
let birdImg;

// bird object
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight,
}

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

window.onload = function() { // upon window loaded
    board = document.getElementById("board"); // getting DOM element and placing it under a variable.
    board.height = boardHeight; // setting the height to the inital, 640.
    board.width = boardWidth; //setting the width to the initial, 360.
    context = board.getContext("2d"); // used for drawing on the board.

    // draw flappy bird
    // context.fillStyle = "green"; // similar to background-color 
    context.fillRect(bird.x, bird.y, bird.width, bird.height); //fills up green to the respective keys of the bird object

    // load images
    birdImg = new Image();
    birdImg.src = "https://raw.githubusercontent.com/ImKennyYip/flappy-bird/master/flappybird.png";
    birdImg.onload = function () { // without this, the image will not be loading onto the canvas
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // extra attribute of the "referenced image" projected onto the bird object
    }

    topPipeImg = new Image();
    topPipeImg.src = "https://raw.githubusercontent.com/ImKennyYip/flappy-bird/master/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "https://raw.githubusercontent.com/ImKennyYip/flappy-bird/master/bottompipe.png";

    
}