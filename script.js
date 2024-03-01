"use strict";

window.addEventListener("load", start);


//******************* Controller */
function start(){
    console.log("JS is working!")
    createView();
    createModel();
    initGame();
}

function initGame(){
    makeBoardClickable();
    showBoard() ;
    setButtons();
    showPlayerTurn()
}

function restartGame(){
    createModel();
    createView();
    initGame();
    currentPlayer = 1;
    showPlayerTurn();
}


const GRID_WIDTH = 7;
const GRID_HEIGHT = 6;

let currentPlayer = 1;

function selectCell(col){
    if(readFromCell(0, col) === 0){
    let row = writeToCell(col, currentPlayer);
    showBoard();
    console.log(model)
    if(checkForWin(row, col) !== false){
        console.log("Winner!")
        winner();
    }
    nextPlayer();
    showPlayerTurn();
    } else {
        console.log("Cell already taken")
    }
}

function winner(){
    showWinner();
    document.querySelector("#board").removeEventListener("click", boardClicked);
}

function nextPlayer(){
    if(currentPlayer === 1){
        currentPlayer = 2;
        setTimeout(computerTurn, 1000);
    } else {
        currentPlayer = 1;
    }
}

function checkForWin(row, col){
    if(checkHorizontal(row, col) || checkVertical(row, col)|| checkDiagonalLeft(row, col) || checkDiagonalRight(row, col)){
        return true;
    }
    return false;

}

function checkHorizontal(row, col){
    let count = 0;
    for(let i = 0; i < GRID_WIDTH; i++){
        if(readFromCell(row, i) === currentPlayer){
            count++;
            if(count === 4){
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

function checkVertical(row, col){
    let count = 0;
    for(let i = 0; i < GRID_HEIGHT; i++){
        if(readFromCell(i, col) === currentPlayer){
            count++;
            if(count === 4){
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

/* function checkDiagonal(row, col){
    let count = 0;
    console.log(`Checking Diagonal: ${row}, ${col}`)
    let nextRow = row - 1;
    let nextCol = col + 1;
    let prevRow = row + 1;
    let prevCol = col - 1;
    while(nextRow >= 0 && nextCol < GRID_WIDTH && nextCol >= 0 && nextRow < GRID_HEIGHT){
        console.log(`Position: ${nextRow}, ${nextCol}`)
        if(readFromCell(nextRow, nextCol) === currentPlayer){
            count++;
            if(count === 3){
                return true;
            }
        } else if(readFromCell(prevRow, prevCol) === currentPlayer){
            count++;
            if(count === 3){
                return true;
            }  
        } else {
            count = 0;
        }
        nextRow--;
        nextCol++;
        prevRow++;
        prevCol--;
    }
} */

function checkDiagonalLeft(row, col){
    let count = 0;
    let startRow = row - Math.min(row, col);
    let startCol = col - Math.min(row, col);
    while(startRow < GRID_HEIGHT && startCol < GRID_WIDTH){

        if(readFromCell(startRow, startCol) === currentPlayer){
            count++;
            if(count === 4){
                return true;
            }
        } else {
            count = 0;
        }
        startRow++;
        startCol++;

    }
    return false;
}

function checkDiagonalRight(row, col){
    let count = 0;
    //let row = parseInt(strRow);
    //let col = parseInt(strCol);
    console.log(`Right Row: ${row}, Col: ${col}`)
    let startRow = row + Math.min(GRID_HEIGHT - 1 - row, col);
    let startCol = col - Math.min(GRID_HEIGHT - 1 - row, col);
    console.log(`Start Row: ${startRow}, Start Col: ${startCol}`)
    while(startRow >= 0 && startCol < GRID_WIDTH){
        console.log(`Checking Row: ${startRow}, Col: ${startCol}`)
        if(readFromCell(startRow, startCol) === currentPlayer){
            count++;
            if(count === 4){
                return true;
            }
        } else {
            count = 0;
        }
        startRow--;
        startCol++;

    }
    return false;
}

//******************* Model */
let model = [];

function writeToCell(col, value){
    for(let row = GRID_HEIGHT - 1; row >= 0; row--){
        if(readFromCell(row, col) === 0){
            model[row][col] = value;
            return row;
        }
    } 
    
}

function readFromCell(row, col){
    return model[row][col];
}

function createModel(){
    for(let row = 0; row < GRID_HEIGHT; row++){
        const newRow = [];
        for(let col = 0; col < GRID_WIDTH; col++){
            newRow[col] = 0;
        }
        model[row] = newRow;
    }
}

function computerTurn(){
    let availableCols = [];
    for(let col = 0; col < GRID_WIDTH; col++){
        if(readFromCell(0, col) === 0){
            availableCols.push(col);
        }
    }
    let col = availableCols[Math.floor(Math.random() * availableCols.length)];
    selectCell(col);

}


//******************* View */
function makeBoardClickable(){
    document.querySelector("#board").addEventListener("click", boardClicked)
}

function boardClicked(event){
    const cell = event.target;
    if(cell.classList.contains("cell") === false){
        return
    }

    const row = cell.dataset.row;
    const col = parseInt(cell.dataset.col);
    

    console.log(`Cell clicked: ${row}, ${col}`);
    selectCell(col);

}

function showBoard(){
    const board = document.querySelector("#board");

    for(let row = 0; row < model.length; row++){
        for(let col = 0; col < model[row].length; col++){
            const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            
            switch(readFromCell(row, col)){
                case 0:
                    cell.textContent = "";
                    break;
                case 1:
                    cell.classList.add("player1");
                    break;
                case 2:
                    cell.classList.add("player2");
                    break;
            
            }
        }
    }

}

function createView(){
    const board = document.querySelector("#board");
    board.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    board.innerHTML = "";
    for(let row = 0; row < GRID_HEIGHT; row++){
        for(let col = 0; col < GRID_WIDTH; col++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
        }
    }
    

}

function setButtons(){
    const restartButton = document.querySelector("#reset");
    restartButton.addEventListener("click", restartGame);

}

function showWinner(){
    const winner = document.querySelector("#winner").textContent = `Player ${currentPlayer} wins!`;
}

function showPlayerTurn(){
    const playerTurn = document.querySelector("#player-turn").textContent = `Player ${currentPlayer}'s turn`;
}