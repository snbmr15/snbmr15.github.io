// board
let board; // setting a variable
let boardWidth = 360;
let boardHeight = 640;
let context; // setting a variable

window.onload = function() { // upon window loaded
    board = document.getElementById("board"); // getting DOM element and placing it under a variable.
    board.height = boardHeight; // setting the height to the inital, 640.
    board.width = boardWidth; //setting the width to the initial, 360.
    context = board.getContext("2d"); // used for drawing on the board.
}