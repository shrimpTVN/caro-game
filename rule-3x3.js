// get Element
const cells= document.querySelectorAll(".cell");
const gameStatus= document.querySelector(".game__status");
const restartBtn=document.querySelector(".restartBtn");

let activeBot =null;
let gameRunning = false;
let status = "Let's start";
let currentPlayer = '';
let gameBoard = [0, 1, 2, 3, 4, 5, 6, 7 , 8];
let winCondition =
    [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7 ,8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]


function game_rule_3_3_off()
{
    // initialize the Game
    initialize();
    activeBot = false;
}

// game_rule_3_3_vsBot();

function game_rule_3_3_vsBot()
{
    // initialize the Game
    initialize();
    activeBot = true;
}


// create restart function
function restartGame()
{
   

    //clear grid game
    cells.forEach(function (cell)
    {
        cell.innerHTML="";
        cell.classList.add("styleHover");
        cell.classList.remove('winState');

         //initialize gameBoard
        gameBoard[ cell.id ] = cell.id;
    });

    currentPlayer='X';
    gameStatus.textContent=`${currentPlayer}'s turn`;
    gameRunning=true;
    
}

function initialize()
{
    gameRunning = true;
    currentPlayer = "X";
    gameStatus.textContent = `${currentPlayer}'s turn`;
    cells.forEach(function (element)
    {
        element.onclick = playerClicked ;
    });
    
    //add listener to restart Button   
    restartBtn.addEventListener('click',restartGame);
     
}

function choose(elementCell)
{
    if (!gameRunning || elementCell.innerHTML!=="")
        return;
    elementCell.classList.remove("styleHover");

    if (currentPlayer=='O')
        {
            elementCell.style.color = 'blue';
        }
    else
        {
            elementCell.style.color = 'red';
        }
    
    elementCell.innerHTML=currentPlayer;
    gameBoard[elementCell.id]=currentPlayer;

    // make action
    gameAction();
}

function getAllEmptyCellsIndexes(currBdSt) {
    return currBdSt.filter(i => i != "O" && i != "X");
}
function playerClicked()
{    

    choose(this);
    // if (!gameRunning || this.innerHTML!=="")
    //         return;
    // this.classList.remove("styleHover");
    
    // if (currentPlayer=='O')
    //     {
    //         this.style.color = 'blue';
    //     }
    // else
    //     {
    //         this.style.color = 'red';
    //     }
    // this.innerHTML=currentPlayer;
           
    // gameBoard[this.id]=currentPlayer;

    // make action
    // gameAction();
}

function highLightWinState( pos)
{
    listCells = Array.from(cells);

    //highlight win state
    for (var i = 0; i < 3; i++)
        listCells[pos[i]].classList.add('winState');
    
    //remove class styleHover beacau the game is over
    for (var i=0; i < 9 ; i++)
        listCells[i].classList.remove('styleHover');
    

  
}

function findWinner(currBoard, currPlayer)
{
    let winState = null;
    for (var i=0; i<winCondition.length ; i++)
    {
        let pos=winCondition[i];
        let cellOne=gameBoard[pos[0]], cellTwo=gameBoard[pos[1]], cellThree=gameBoard[pos[2]];
        
        if (cellOne==="" || cellTwo==="" || cellThree==="")
            continue;
        
        if (cellOne===cellTwo && cellTwo===cellThree && cellOne === currPlayer)
        {
            winState = pos;
            break;
        }
    }
    return winState;
}

function gameAction()
{
    var winState = findWinner(gameBoard, currentPlayer);
    if ( winState !=null)
    {
        gameStatus.textContent = `${currentPlayer}'s win! Congratulate!!!`;
        gameRunning = false;
        highLightWinState(winState);
        // console.log(gameStatus.textContent);
    }
    else
    if ( getAllEmptyCellsIndexes(gameBoard).length == 0 )
    {
        gameRunning = false;
        gameStatus.textContent="Draw!";
    }
    else
    {
        changePlayer();
    }
}

function changePlayer()
{
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameStatus.textContent = `${currentPlayer}'s turn`;

    if (activeBot && currentPlayer === 'O')
        botAction();
}



function botAction()
{
  let aiMark = 'O', huMark = 'X';


  function minimax(currBoard, currMark)
   {
    var availidCellsIndexes = getAllEmptyCellsIndexes(currBoard);
    if (findWinner(currBoard, aiMark) !=null)
        {
            return { score: 10};
        }
    if (findWinner(currBoard, huMark) != null)
        {
            return { score: -10};
        }
    else
    if (availidCellsIndexes.length == 0)
        {
            return { score: 0};
        }
    const testPlayInfos = [];
    for (var i=0 ; i < availidCellsIndexes.length; i++)
        {
           
            var currTestPlayInfo = {
                index: '0',
                score: '0'
            };
            currTestPlayInfo.index = currBoard[availidCellsIndexes[i]];
            currBoard[availidCellsIndexes[i]] = currMark;

            if (currMark === aiMark)
                {
                    var result = {
                        score: '0',
                        index: '0'
                    };
                  result = minimax(currBoard, huMark);
                  currTestPlayInfo.score = result.score;    
                }
            else
            if ( currMark === huMark)
                {
                    var result = {
                        score: '0',
                        index: '0'
                    };
                    result = minimax(currBoard, aiMark);
                    currTestPlayInfo.score = result.score;   
                }

            currBoard[availidCellsIndexes[i]] = currTestPlayInfo.index;
            testPlayInfos.push(currTestPlayInfo);
        }

    // bestIndex store the index of best score for current player
    let bestIndex = null , bestScore;
    if (currMark  === aiMark)
    {
         bestScore = -10000;
        for (var i = 0; i < testPlayInfos.length ;i++)
            if (testPlayInfos[i].score > bestScore)
            {
                bestScore = testPlayInfos[i].score;
                bestIndex = i;
            }
    }
    else
    {
         bestScore = 10000;
        for (var i = 0; i < testPlayInfos.length ;i++)
        {
            if (testPlayInfos[i].score < bestScore)
                {
                    bestScore = testPlayInfos[i].score;
                    bestIndex = i;
                }
        }            
    }

    return testPlayInfos[bestIndex];
  }
  
  var cellBotChosen = minimax(gameBoard, aiMark);

  choose(cells[cellBotChosen.index]);
}


