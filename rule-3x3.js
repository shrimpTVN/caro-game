
function game_rule_33(activeBot)
{
    // get Element
    var cells= document.querySelectorAll(".cell");
    var gameStatus= document.querySelector(".game__status");
    var restartBtn=document.querySelector(".restartBtn");

    
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


    initialize();


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
            gameStatus.textContent = `${currentPlayer} win! Congratulate!!!`;
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
    var availidCellsIndexes = getAllEmptyCellsIndexes(gameBoard);
    var count = 0;


    function minimax(currBoard, currMark , depth, alpha, beta)
    {
        // console.log(count++);
        count++;
      
        if (findWinner(currBoard, aiMark) !=null)
            {
                return { score: 1000 - depth};
            }
        if (findWinner(currBoard, huMark) != null)
            {
                return { score: depth - 1000};
            }
        else
        if (availidCellsIndexes.length == depth)
            {
                return { score: 0};
            }
        const testPlayInfos = [];
        for (var i = 0 ; i < availidCellsIndexes.length; i++)
            {
            
                var currTestPlayInfo = {};
                currTestPlayInfo.index = currBoard[availidCellsIndexes[i]];
                currBoard[availidCellsIndexes[i]] = currMark;

                if (currMark === aiMark)
                    {
                        var result = {};
                    result = minimax(currBoard, huMark, depth+1,  alpha, beta);
                    currTestPlayInfo.score = result.score;    
                    alpha  = Math.max(alpha, result.score);
                 
    
                    }
                else
                if ( currMark === huMark)
                    {
                        var result = {};
                        result = minimax(currBoard, aiMark, depth+1, alpha, beta);
                        currTestPlayInfo.score = result.score;   
                        beta  = Math.min(beta, result.score);

                       
        
                    }

                currBoard[availidCellsIndexes[i]] = currTestPlayInfo.index;
                testPlayInfos.push(currTestPlayInfo);
                
                if (alpha >= beta)
                    break;
            

            }

        // bestIndex store the index of best score for current player
        let bestIndex = null , bestScore;
        if (currMark  === aiMark)
        {
            bestScore = -1e9;
            for (var i = 0; i < testPlayInfos.length ;i++)
                if (testPlayInfos[i].score > bestScore)
                {
                    bestScore = testPlayInfos[i].score;
                    bestIndex = i;
                }
        }
        else
        {
            bestScore = 1e9;
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
    

    var cellBotChosen = minimax(gameBoard, aiMark, 0, -Infinity, +Infinity);
    console.log(count);
    console.log(cellBotChosen);
    choose(cells[cellBotChosen.index]);
    }

}
