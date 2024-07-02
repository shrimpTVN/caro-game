const nCells = 16;
var gameContainer = document.querySelector('.game_container_16');
var gameGrid = gameContainer.querySelector('.game-16__grid');


var gameBoard = new Array(nCells);
for (var i=0; i < nCells; i++)
    {
        gameBoard[i] = new Array(nCells);
    }
// call function to draw the game grid 16x16
createGrid();




// create 16x16 cell
function createGrid()
{
    var stringGrid="";
    for (var i=0; i < nCells ; i++)
        for (var j=0; j < nCells; j++)
        {
            stringGrid += `<div class="cell-small styleHover" id="${i}-${j}"></div>`;
            gameBoard[i][j] = i + '-' + j;
        }
   gameGrid.innerHTML = stringGrid;
}

// initialize variable
var listCells = gameGrid.querySelectorAll('.cell-small');
var gameStatus = gameContainer.querySelector('.game-16__status');
var restartBtn = gameContainer.querySelector('.game-16__restartBtn');
var gameRunning = false;
var currentPlayer = "";

// call function to start the game
initialize();

// build functions
function restartGame()
{
    gameRunning = true;
    currentPlayer = 'X';
    gameStatus.innerHTML  = `${currentPlayer}'s turn!!!`;
    // console.log(restartBtn);
    Array.from(listCells).forEach( function (cell, index){
        cell.innerHTML = "";
        cell.classList.add('styleHover');
        cell.classList.remove('winState');
    });

    for (var i=0; i < nCells ; i++)
        for (var j=0; j< nCells ; j++)
            {
                gameBoard[i][j] = `${i}-${j}`;
            }
    

}

function initialize()
{
    gameRunning = true;
    currentPlayer = 'X';
    gameStatus.textContent =`${currentPlayer}'s turn`;
    restartBtn.onclick = restartGame;

    
    Array.from(listCells).forEach( function (cell)
    {
            cell.onclick = function (event)
            {
       
                // console.log(event.target);
                choose(this);
            }
    });
}

function getXY(id)
{
    var coor = id.split('-');
    return {
            x: Number(coor[0]),
            y: Number(coor[1])
            }
} 

function updateGameBoard(coor)
{
    gameBoard[ coor['x'] ][ coor['y'] ] = currentPlayer;
}

function choose(cell)
{
    if (!gameRunning || cell.innerHTML !="")
            return;
    
    cell.classList.remove('styleHover');
    cell.innerHTML = currentPlayer;
    cell.style.color  = ( currentPlayer === 'X' ? 'blue' : 'red');

    updateGameBoard( getXY(cell.id) );
    gameAction();
}


function outBoard(x,y)
{
    return (x<0 || y<0 || x >=nCells || y>=nCells);
}

function check(x, y, i, j, player)
{
    var state = "";
    var cnt = 0;
    
    for (var k=0; k < 5 && !outBoard(x + i*k, y + j*k); k++)
        if (gameBoard[x + i*k][y + j*k] == player)
        {
            cnt++;
            state += `${x +i*k}-${y + j*k}.`;
        }

    if (cnt == 5)
        return state;

    return "";
}

function findWinner(player)
{
    // create Array steps to go to 8 trends
    var steps = 8;
    var stepsArr = [[-1,  0], [1, 0], 
                    [-1, -1], [1, 1],
                    [0,  -1], [0, 1],
                    [1,  -1], [-1, 1]];

    var winState;

    for (var x=0; x < nCells ; x++)
        for (var y=0; y < nCells; y++)
        {
            for (var i=0; i < steps ; i++)
            {
               winState = check(x, y, stepsArr[i][0], stepsArr[i][1], player);

               if (winState.length > 0)
                    return winState;
            }
        }

    return "";
}


function getAllEmptyCellsIndexes(currBoard)
{
    var arrEmptyCells = [];

    for (var i=0; i < nCells ; i++)
        for (var j=0; j< nCells ; j++)
            if (gameBoard[i][j] != 'X' && gameBoard[i][j] != 'O')
                arrEmptyCells.push(gameBoard[i][j]);
    
    return arrEmptyCells;
}

function highLightWinState(winState)
{
    var state = winState.split('.');

    for (var i=0; i < state.length - 1; i++)
        {
            var coor = getXY(state[i]);
            listCells[ coor['x']*16 + coor['y']].classList.add('winState') ;
       
            Array.from(listCells).forEach( function(cell){
                cell.classList.remove('styleHover');
            } );
        }
}

function gameAction()
{
    var winState = findWinner(currentPlayer);

    if (winState.length >0)
        {
            gameRunning = false;
            gameStatus.innerHTML = `${currentPlayer} win!!! Congratulate!!`;
            highLightWinState(winState);
            return;
        }
    else
    if (getAllEmptyCellsIndexes(gameBoard).length == 0)
    {
        gameRunning = false;
        gameStatus.innerHTML = `Drawww!!!`;
        return;
    }
    else
    changePlayer();
}


function changePlayer()
{
    currentPlayer = (currentPlayer == 'X' ? 'O' : 'X');
    gameStatus.innerHTML = `${currentPlayer}'s turn!!!`;
}