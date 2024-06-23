// get Element

const cells= document.querySelectorAll(".cell");
const gameStatus= document.querySelector(".game-status");
const restartBtn=document.querySelector(".restartBtn");

let gameRunning= false;
let status="Let's start";
let currentPlayer='';
let roundGame=["", "", "" ,"" ,"", "", "", "" ,"" ];
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
// initialize the Game
initialize();

function initialize()
{
    gameRunning=true;
    currentPlayer="X";
    gameStatus.textContent=`${currentPlayer}'s turn`;
    cells.forEach(function (element)
    {
        element.addEventListener('click',playerClicked);
      
    });
    
    restartBtn.addEventListener('click',restartGame);
}

function playerClicked()
{
    if (!gameRunning || this.innerHTML!=="")
            return;
    this.classList.remove("styleHover");
    
    this.innerHTML=currentPlayer;
    roundGame[this.id]=currentPlayer;
    checkWinner();
}

function changePlayer()
{
    currentPlayer= currentPlayer==="X" ? "O" : "X";
    gameStatus.textContent=`${currentPlayer}'s turn`;
}

function checkWinner()
{
    var haveWinner=false;
    for (var i=0; i<winCondition.length ; i++)
    {
        let pos=winCondition[i];
        let cellOne=roundGame[pos[0]], cellTwo=roundGame[pos[1]], cellThree=roundGame[pos[2]];
        
        if (cellOne==="" || cellTwo==="" || cellThree==="")
                continue;
        
        if (cellOne===cellTwo && cellTwo===cellThree)
        {
           haveWinner=true;
            break;
        }
    }

    
    if (haveWinner)
    {
        gameStatus.textContent = `${currentPlayer}'s win! Congratulate!!!`;
        gameRunning= false;
        console.log(gameStatus.textContent);
       
    }
    else
    if (!roundGame.includes(""))
    {
        gameRunning=false;
        gameStatus.textContent="Draw!";
    }
    else
    {
        changePlayer();
    }
}

function restartGame()
{
    //initialize roundGame
    roundGame.fill("");

    //clear grid game
    cells.forEach(function (element)
    {
        element.innerHTML="";
        element.classList.add("styleHover");
    });

    currentPlayer='X';
    gameStatus.textContent=`${currentPlayer}'s turn`;
    gameRunning=true;
    
}