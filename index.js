var chooseMode = document.querySelector(".choose-mode"),
  chooseBar = chooseMode.querySelector(".choose-bar");

getChoose();

// game_rule_33(true);
// game_rule_16(true);

// listen choose-bar
function getChoose() {
  var playerChosen = {};

  function checkPlayerChoose(chooseMenu, chooseNextMenu) {
    var choosePlayerBtns = chooseMenu.querySelectorAll(".btn");
    Array.from(choosePlayerBtns).forEach(function (element, index) {
      element.onclick = function (event) {
        if (this.id == "choose-bar__undleBtn") {
          reset(chooseMenu);
          return;
        }
        playerChosen[chooseMenu.className] = this.id;
        chooseMenu.classList.add("hide");

        if (chooseNextMenu) chooseNextMenu.classList.remove("hide");
        else drawMap(playerChosen);
      };
    });
  }

  var choosePlayer = chooseBar.querySelector(".choose-player");
  var chooseMap = chooseBar.querySelector(".choose-map");
  var chooseStart = chooseBar.querySelector(".choose-start");

  checkPlayerChoose(choosePlayer, chooseMap);
  checkPlayerChoose(chooseMap, chooseStart);
  checkPlayerChoose(chooseStart, undefined);
}

function drawMap(playerChosen) {
  // check for map 3x3
  if (
    playerChosen["choose-map"] == "choose-map__map3x3-Btn" &&
    playerChosen["choose-start"] == "choose-bar__start"
  ) {
    chooseMode.classList.add("hide");
    var gameBoard = document.querySelector(".gameContainer-3x3");
    gameBoard.classList.remove("hide");
    console.log(gameBoard);
    // check rule for game
    if (playerChosen["choose-player"] == "choose-player__personBtn") {
      game_rule_33(false);
    } else if (playerChosen["choose-player"] == "choose-player__botBtn") {
      game_rule_33(true);
    }
  }

  // check for map 16x16
  if (
    playerChosen["choose-map"] == "choose-map__map16x16-Btn" &&
    playerChosen["choose-start"] == "choose-bar__start"
  ) {
    var welcomBoar = document.querySelector(".welcome-bar");
    welcomBoar.classList.add("hide");
    var gameBoard = document.querySelector(".game_container_16");
    gameBoard.classList.remove("hide");

    // check rule for game
    if (playerChosen["choose-player"] == "choose-player__personBtn") {
      game_rule_16(false);
    } else if (playerChosen["choose-player"] == "choose-player__botBtn") {
      game_rule_16(true);
    }
  }
}

function reset(currentMenu) {
  if (currentMenu) currentMenu.classList.add("hide");
  var choosePlayerMenu = chooseBar.querySelector(".choose-player");
  choosePlayerMenu.classList.remove("hide");
}
