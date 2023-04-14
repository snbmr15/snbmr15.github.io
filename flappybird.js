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

// game physics
let velocityX = -2; //pipes moving left
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

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
    birdImg.src = "https://gcdnb.pbrd.co/images/I7MaI9anW43F.png?o=1";
    birdImg.onload = function () { // without this, the image will not be loading onto the canvas
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // extra attribute of the "referenced image" projected onto the bird object
    }

    topPipeImg = new Image();
    topPipeImg.src = "https://gcdnb.pbrd.co/images/omoucOPFOZTr.png?o=1";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "https://gcdnb.pbrd.co/images/TEt2jiJH2LWE.png?o=1";

    requestAnimationFrame(update); // refreshes the frame rate
    setInterval(placePipes, 1500); // spawns pipes at the certain amount of seconds

    document.addEventListener("keydown", moveBird); // for every key down, moveBird function will be called

}

function update() { // this function will centralise all frame updates of the elements
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }
    context.clearRect(0,0, board.width, board.height); // resets to the beginning of the game

    // draw bird
    velocityY += gravity;
    // bird.y += velocityY; // the bird is able to jump out of canvas and fall back in, vice versa
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y, limit the bird to the top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) { // if the bird falls to the ground
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i]; // calling out each element of the pipe in the array
        pipe.x += velocityX; // keeps shifting the pipes 2px to the left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // draws out the pipes

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // as there are 2 pipes. 
            pipe.passed = true;
        }
        if (detectCollisions(bird, pipe)) {
            gameOver = true;
        }
    }

    // clear Pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // removes the first element of the array
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() { // spawning of pipes

    if (gameOver) {
        return;
    }

    // (0-1) * pipeHeight/2
    // 0 -> -123 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); // shifts the pipe upwards out of the canvas
    let openingSpace = board.height/4;

    let topPipe = { 
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //checks if the flappy bird has passed the pipe
    }

    pipeArray.push(topPipe); // adds into the array

    let bottomPipe = { 
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //checks if the flappy bird has passed the pipe
    }

    pipeArray.push(bottomPipe); // adds into the array    

}

function moveBird(event) {
    if (event.code == "Space" || event.code == "ArrowUp") {
        // jump
        velocityY = -6;

       //reset game
       if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    } 
    }
}

function detectCollisions(a,b) {
    return a.x < b.x + b.width && 
    a.x + a.width > b.x && 
    a.y < b.y + b.height && 
    a.y + a.height > b.y;
}