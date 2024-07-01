var chooseMode = document.querySelector('.choose-mode'),
chooseBar =  chooseMode.querySelector('.choose-bar');
getChoose();
// listen choose-bar
function getChoose()
{
    var playerChosen = {};
    function checkPlayerChoose( chooseMenu, chooseNextMenu)
    {
        var choosePlayerBtns = chooseMenu.querySelectorAll(".btn");
        Array.from(choosePlayerBtns).forEach(function(element, index)
                {
                        element.onclick = function (event)
                        {
                            if (this.id=='choose-bar__undleBtn')
                            {
                                reset(chooseMenu);
                                return;
                            }
                                playerChosen[chooseMenu.className] = this.id;
                                chooseMenu.classList.add('hide');
    
                                if (chooseNextMenu)
                                    chooseNextMenu.classList.remove('hide');
                                else
                                     drawMap(playerChosen);
                            
                        }
                }); 
    }

    var choosePlayer =  chooseBar.querySelector('.choose-player');
    var chooseMap =  chooseBar.querySelector('.choose-map');
    var chooseStart =  chooseBar.querySelector('.choose-start');

    checkPlayerChoose(choosePlayer, chooseMap);
    checkPlayerChoose(chooseMap, chooseStart);
    checkPlayerChoose(chooseStart, undefined);
  
}

function drawMap( playerChosen)
{
    if (playerChosen['choose-map'] == 'choose-map__map3x3-Btn' && 
        playerChosen['choose-start'] == 'choose-bar__start')
        {
            chooseMode.classList.add('hide');
            var gameBoard = document.querySelector('.gameContainer-3x3');
            gameBoard.classList.remove('hide');   
            
            // check rule for game
            if (playerChosen['choose-player'] == 'choose-player__personBtn' )
                {
                    game_rule_3_3_off();
                }
            else
            if (playerChosen['choose-player'] == 'choose-player__botBtn' )
                {
                    game_rule_3_3_vsBot();
                }

        }
}

function reset( currentMenu)
{
    currentMenu.classList.add('hide');
    var choosePlayerMenu =  chooseBar.querySelector('.choose-player');
    choosePlayerMenu.classList.remove('hide');
}




