// board
let board; // setting a variable
let boardWidth = 360; // follow image size
let boardHeight = 640; // follow image size
let context; // setting a variable

// bird
let birdWidth = 34; 
let birdHeight = 24;

// to get the bird spawning a certain location of the board
// in canvas, the x-axis and y-xis exists at the top left of the canvas (positive values)
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
let pipeX = boardWidth;  // limit it within board width
let pipeY = 0; // starts from the top left of the board so it generates from top to bottom

let topPipeImg;
let bottomPipeImg;

// game physics
let velocityX = -2; //pipes moving left
let velocityY = 0; // bird jump speed
let gravity = 0.4; // also a y-axis element

let gameOver = false; // game always running until it hits one of the gameOver conditions
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
    requestAnimationFrame(update); // refreshes the frame rate

    if (gameOver) {
        // this is for when condition is false hence the game will load as per usual
        return;
    }

    // this applies to the first refresh/ loading of the game
    context.clearRect(0,0, board.width, board.height); // resets to the beginning of the game

    // draw bird
    velocityY += gravity; // when velocityY is 6 (user input jump), the gravity will offset it accordingly to simulate the physics in the game.
    // also if the gravity was negative, the bird will continue to stay to the top of the board even if there is user input as the user input is of a negative value (basically cancels the action)
    // bird.y += velocityY; // the bird is able to jump out of canvas and fall back in, vice versa
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y, limit the bird to the top of the canvas as 0 is the top of the canvas.
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) { // if the bird falls to the ground 
        // the moment bird. y > 640px, it goes off canvas
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i]; // calling out each element of the pipe in the array
        pipe.x += velocityX; // keeps shifting the pipes 2px to the left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // draws out the pipes

        if (!pipe.passed && bird.x > pipe.x + pipe.width) { // horizontal movement
            // !pipe.passed condition = it passes through the opening
            // bird.x = 34px 
            // pipe.x = boardwidth which is 360px
            // pipe.width = 64px
            score += 0.5; // as there are 2 pipes. 
            pipe.passed = true;
        }
        if (detectCollisions(bird, pipe)) {
            gameOver = true;
        }
    }

    // clear Pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        // const firstPipe = pipeArray.shift();
        // console.log(firstPipe); // shows in console the topPipe and bottomPipe first combined set removed
        pipeArray.shift(); // removes the first element of the array
    }

    // score
    context.fillStyle = "black";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90); // color will also be in black as it references from the previous property
    }
}

function placePipes() { // spawning of pipes

    if (gameOver) {
        // this is for when condition is false hence the game will load as per usual
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
        y : randomPipeY + pipeHeight + openingSpace, // shifts the bottomPipe down (+value)
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

    // first two conditions are for horizontal condition, the last two are for vertical condition
}