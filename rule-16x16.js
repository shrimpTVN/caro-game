function game_rule_16(activeBot) {
  const nCells = 16;
  const winScore = 1e9;
  var gameContainer = document.querySelector(".game_container_16");
  var gameGrid = gameContainer.querySelector(".game-16__grid");

  // khai báo các biến toàn cục
  // create game board 2D
  var gameBoard = new Array(nCells);
  for (var i = 0; i < nCells; i++) {
    gameBoard[i] = new Array(nCells);
  }

  // call function to draw the game grid 16x16
  createGrid();
  // create 16x16 cell
  function createGrid() {
    var stringGrid = "";
    for (var i = 0; i < nCells; i++)
      for (var j = 0; j < nCells; j++) {
        stringGrid += `<div class="cell-small styleHover" id="${i}-${j}"></div>`;
        gameBoard[i][j] = `${i}-${j}`;
      }

    gameGrid.innerHTML = stringGrid;
  }

  // initialize variable
  var listCells = gameGrid.querySelectorAll(".cell-small");
  var gameStatus = gameContainer.querySelector(".game-16__status");
  var restartBtn = gameContainer.querySelector(".game-16__restartBtn");
  var gameRunning = false;
  var currentPlayer = {};

  // call function to start the game
  initialize();

  // build functions
  function restartGame() {
    gameRunning = true;
    currentPlayer.mark = "X";
    gameStatus.innerHTML = `${currentPlayer.mark}'s turn!!!`;

    Array.from(listCells).forEach(function (cell, index) {
      cell.innerHTML = "";
      cell.classList.add("styleHover");
      cell.classList.remove("winState");
    });

    for (var i = 0; i < nCells; i++)
      for (var j = 0; j < nCells; j++) {
        gameBoard[i][j] = `${i}-${j}`;
      }
  }

  function initialize() {
    gameRunning = true;
    currentPlayer.mark = "X";
    gameStatus.textContent = `${currentPlayer.mark}'s turn`;
    restartBtn.onclick = restartGame;

    Array.from(listCells).forEach(function (cell) {
      cell.onclick = function (event) {
        // console.log(event.target);
        choose(this);
      };
    });
  }

  function getXY(id) {
    var coor = id.split("-");
    return {
      x: Number(coor[0]),
      y: Number(coor[1]),
    };
  }

  // đánh dấu ô đã được đánh
  function updateGameBoard(coor) {
    gameBoard[coor["x"]][coor["y"]] = currentPlayer.mark;
  }

  function choose(cell) {
    if (!gameRunning || cell.innerHTML != "") return;

    var coor = getXY(cell.id);

    currentPlayer["x"] = coor["x"];
    currentPlayer["y"] = coor["y"];

    currentPlayer.index = cell.id;

    cell.classList.remove("styleHover");
    cell.innerHTML = currentPlayer.mark;
    cell.style.color = currentPlayer.mark === "X" ? "blue" : "red";

    updateGameBoard(getXY(cell.id));
    gameAction();
  }

  function outBoard(x, y) {
    return x < 0 || y < 0 || x >= nCells || y >= nCells;
  }

  function check(curPlayer, i, j) {
    var state = "";
    var cnt = 0;
    var x = curPlayer["x"],
      y = curPlayer["y"];

    for (var k = 0; k < 5 && !outBoard(x + i * k, y + j * k); k++)
      if (gameBoard[x + i * k][y + j * k] == curPlayer.mark) {
        cnt++;
        state += `${x + i * k}-${y + j * k}.`;
      } else break;

    // Kiểm tra hướng còn lại
    i = -i;
    j = -j;
    for (var k = 1; k < 5 && !outBoard(x + i * k, y + j * k); k++)
      if (gameBoard[x + i * k][y + j * k] == curPlayer.mark) {
        cnt++;
        state += `${x + i * k}-${y + j * k}.`;
      } else break;

    if (cnt >= 5) return state;

    return "";
  }

  function findWinner(curPlayer) {
    // create Array steps to go to 8 trends
    var steps = 4;
    var stepsArr = [
      [-1, -1],
      [-1, 0],
      [0, -1],
      [1, -1],
    ];

    var winState = "";
    for (var i = 0; i < steps; i++) {
      winState = check(curPlayer, stepsArr[i][0], stepsArr[i][1]);

      if (winState.length > 0) return winState;
    }

    return "";
  }

  function getAllEmptyCellsIndexes() {
    var arrEmptyCells = [];

    for (var i = 0; i < nCells; i++)
      for (var j = 0; j < nCells; j++)
        if (gameBoard[i][j] != "X" && gameBoard[i][j] != "O")
          arrEmptyCells.push(gameBoard[i][j]);

    return arrEmptyCells;
  }
  // chỉ chọn những ô xung quanh ô đã đánh
  function getAvailidCells() {
    var allAvailidCells = [];

    for (var i = 0; i < nCells; i++) {
      for (var j = 0; j < nCells; j++)
        if (gameBoard[i][j].length > 1) {
          // nếu ô hiện tại đã được đánh
          // bao hàm cả i == nCells -1
          if (i > 0) {
            if (j > 0) {
              if (
                gameBoard[i - 1][j - 1].length == 1 ||
                gameBoard[i][j - 1].length == 1
              ) {
                allAvailidCells.push(gameBoard[i][j]);
                continue;
              }
            }
            if (j < nCells - 1) {
              if (
                gameBoard[i - 1][j + 1].length == 1 ||
                gameBoard[i][j + 1].length == 1
              ) {
                allAvailidCells.push(gameBoard[i][j]);
                continue;
              }
            }

            if (gameBoard[i - 1][j].length == 1) {
              allAvailidCells.push(gameBoard[i][j]);
              continue;
            }
          }
          // bao hàm cả i==0
          if (i < nCells - 1) {
            if (j > 0) {
              if (
                gameBoard[i + 1][j - 1].length == 1 ||
                gameBoard[i][j - 1].length == 1
              ) {
                allAvailidCells.push(gameBoard[i][j]);
                continue;
              }
            }

            if (j < nCells - 1) {
              if (
                gameBoard[i + 1][j + 1].length == 1 ||
                gameBoard[i][j + 1].length == 1
              ) {
                allAvailidCells.push(gameBoard[i][j]);
                continue;
              }
            }
            if (gameBoard[i + 1][j].length == 1) {
              allAvailidCells.push(gameBoard[i][j]);
              continue;
            }
          }
        }
    }

    return allAvailidCells;
  }

  function highLightWinState(winState) {
    var state = winState.split(".");

    for (var i = 0; i < state.length - 1; i++) {
      var coor = getXY(state[i]);
      listCells[coor["x"] * nCells + coor["y"]].classList.add("winState");

      Array.from(listCells).forEach(function (cell) {
        cell.classList.remove("styleHover");
      });
    }
  }

  function gameAction() {
    var winState = findWinner(currentPlayer);

    if (winState.length > 0) {
      gameRunning = false;
      gameStatus.innerHTML = `${currentPlayer.mark} win!!! Congratulate!!!`;
      highLightWinState(winState);
      return;
    } else if (getAllEmptyCellsIndexes().length == 0) {
      gameRunning = false;
      gameStatus.innerHTML = `Drawww!!!`;
      return;
    } else changePlayer();
  }

  function changePlayer() {
    currentPlayer.mark = currentPlayer.mark == "X" ? "O" : "X";
    gameStatus.innerHTML = `${currentPlayer.mark}'s turn!!!`;

    if (currentPlayer.mark == "O" && activeBot) {
      botAction();
    }
  }

  function botAction() {
    let aiMark = "O",
      huMark = "X";
    var count = 0;

    function minimax(curMark, depth, alpha, beta, preIndex) {
      count++;
      var availidCellsIndexes = getAvailidCells();

      var prePlayer = {
        x: preIndex["x"],
        y: preIndex["y"],
        mark: curMark == aiMark ? huMark : aiMark,
      };

      // nếu hiện tại là huMark thì có nghĩa là nước trước đó là aiMark

      if (curMark == huMark && findWinner(prePlayer)) {
        return { score: winScore - depth };
      }
      // nếu hiện tại là aiMark thì có nghĩa là nước trước đó là huMark
      else if (curMark == aiMark && findWinner(prePlayer)) {
        return { score: 0 };
      } else if (depth === 3 || availidCellsIndexes.length == 0) {
        return { score: evaluateBoardForWhite(prePlayer.mark) };
      }

      var bestMove = {
        score: curMark == aiMark ? -1e9 : 1e9,
        index: "",
      };

      for (var i = 0; i < availidCellsIndexes.length; i++) {
        var curCoor = getXY(availidCellsIndexes[i]);
        gameBoard[curCoor["x"]][curCoor["y"]] = curMark;

        // play for maximizer
        if (curMark == aiMark) {
          var result = minimax(huMark, depth + 1, alpha, beta, curCoor);
          if (result.score > bestMove.score) {
            bestMove.score = result.score;
            bestMove.index = availidCellsIndexes[i];
          }
          alpha = Math.max(alpha, result.score);
        }
        // play for minimizer
        else if (curMark == huMark) {
          var result = minimax(aiMark, depth + 1, alpha, beta, curCoor);
          if (result.score < bestMove.score) {
            bestMove.score = result.score;
            bestMove.index = availidCellsIndexes[i];
          }
          beta = Math.min(beta, result.score);
        }

        gameBoard[curCoor["x"]][curCoor["y"]] = availidCellsIndexes[i];

        if (alpha >= beta) {
          break;
        }
      }

      return bestMove;
    }

    var cellBotChosen = minimax(aiMark, 0, -1e9, +1e9, {
      x: currentPlayer["x"],
      y: currentPlayer["y"],
    });
    console.log(count);
    console.log(cellBotChosen);

    var coor = getXY(cellBotChosen.index);
    choose(listCells[coor["x"] * nCells + coor["y"]]);
  }

  // evaluateBoardForWhite( prePlayer.mark )
  function evaluateBoardForWhite(userTurn) {
    let blackScore = getScore("X", userTurn);
    let whiteScore = getScore("O", userTurn);

    if (blackScore == 0) blackScore = 1.0;

    return whiteScore / blackScore;
  }

  function getScore(forX, blacksTurn) {
    return (
      evaluateHorizontal(forX, blacksTurn) +
      evaluateVertical(forX, blacksTurn) +
      evaluateDiagonal(forX, blacksTurn)
    );
  }

  function evaluateHorizontal(forX, playersTurn) {
    let consecutive = 0,
      blocks = 2,
      score = 0;

    for (var i = 0; i < nCells; i++) {
      for (var j = 0; j < nCells; j++) {
        if (gameBoard[i][j] == forX) {
          consecutive++;
        }
        // gặp ô trống
        else if (gameBoard[i][j].length > 1) {
          if (consecutive > 0) {
            blocks--;
            score += getConsecutiveSetScore(
              consecutive,
              blocks,
              forX == playersTurn
            );
            consecutive = 0;
            blocks = 1;
          } else {
            blocks = 1;
          }
        }
        // gặp quân địch
        else if (consecutive > 0) {
          score += getConsecutiveSetScore(
            consecutive,
            blocks,
            forX == playersTurn
          );
          consecutive = 0;
          blocks = 2;
        } else {
          blocks = 2;
        }
      }
      // nếu đến cuối hàng mà vẫn liêu tục thì vẫn tính điểm
      if (consecutive > 0) {
        score += getConsecutiveSetScore(
          consecutive,
          blocks,
          forX == playersTurn
        );
      }

      // reset lại giá trị cho hàng tiếp theo
      consecutive = 0;
      blocks = 2;
    }

    return score;
  }

  function evaluateVertical(forX, playersTurn) {
    let score = 0,
      consecutive = 0,
      blocks = 2;

    for (var j = 0; j < nCells; j++) {
      for (var i = 0; i < nCells; i++) {
        // gặp ô giống quân đang cần đếm
        if (gameBoard[i][j] == forX) {
          consecutive++;
        }
        // gặp ô trống
        else if (gameBoard[i][j].length > 1) {
          if (consecutive > 0) {
            blocks--;
            score += getConsecutiveSetScore(
              consecutive,
              blocks,
              forX == playersTurn
            );
            consecutive = 0;
            blocks = 1;
          } else {
            blocks = 1;
          }
        }
        // gặp quân đich
        else if (consecutive > 0) {
          score += getConsecutiveSetScore(
            consecutive,
            blocks,
            forX == playersTurn
          );
          consecutive = 0;
          blocks = 2;
        } else {
          blocks = 2;
        }
      }

      if (consecutive > 0) {
        score += getConsecutiveSetScore(
          consecutive,
          blocks,
          forX == playersTurn
        );
      }

      // reset lai gia trị cho cột tiếp theo
      consecutive = 0;
      blocks = 2;
    }

    return score;
  }

  function evaluateDiagonal(forX, playersTurn) {
    let score = 0,
      consecutive = 0,
      blocks = 2;

    // đường chéo /
    for (var k = 0; k <= 2 * (nCells - 1); k++) {
      let iStart = Math.max(0, k - nCells + 1);
      let iEnd = Math.min(nCells - 1, k);

      for (var i = iStart; i <= iEnd; i++) {
        let j = k - i;
        if (gameBoard[i][j] == forX) {
          consecutive++;
        }
        // gặp ô trống
        else if (gameBoard[i][j].length > 1) {
          if (consecutive > 0) {
            blocks--;
            score += getConsecutiveSetScore(
              consecutive,
              blocks,
              forX == playersTurn
            );
            consecutive = 0;
            blocks = 1;
          } else {
            blocks = 1;
          }
        } else if (consecutive > 0) {
          score += getConsecutiveSetScore(
            consecutive,
            blocks,
            forX == playersTurn
          );
          consecutive = 0;
          blocks = 2;
        } else {
          blocks = 2;
        }
      }

      if (consecutive > 0) {
        score += getConsecutiveSetScore(
          consecutive,
          blocks,
          forX == playersTurn
        );
      }

      blocks = 2;
      consecutive = 0;
    }

    // đường chéo \
    for (var k = 1 - nCells; k < nCells; k++) {
      let iStart = Math.max(0, k);
      let iEnd = Math.min(nCells + k - 1, nCells - 1);

      for (var i = iStart; i <= iEnd; i++) {
        let j = i - k;
        if (gameBoard[i][j] == forX) {
          consecutive++;
        }
        // gặp ô trống
        else if (gameBoard[i][j].length > 0) {
          if (consecutive > 0) {
            blocks--;
            score += getConsecutiveSetScore(
              consecutive,
              blocks,
              forX == playersTurn
            );
            consecutive = 0;
            blocks = 1;
          } else {
            blocks = 1;
          }
        }
        // gặp quân địch
        else if (consecutive > 0) {
          score += getConsecutiveSetScore(
            consecutive,
            blocks,
            forX == playersTurn
          );
          consecutive = 0;
          blocks = 2;
        } else {
          blocks = 2;
        }
      }

      if (consecutive > 0) {
        score += getConsecutiveSetScore(
          consecutive,
          blocks,
          forX == playersTurn
        );
      }

      consecutive = 0;
      blocks = 2;
    }

    return score;
  }

  function getConsecutiveSetScore(count, blocks, currPlayerTurn) {
    let winGuarantee = 1e6;

    switch (count) {
      // nếu đủ 5 quân -> thắng , trả về điểm thắng
      case 5: {
        return winScore;
      }
      case 4: {
        // nếu 4 con mà đến lượt người đó đnahs -> thắng, trả về winScore
        if (currPlayerTurn) return winScore;
        else {
          // ngược lại thì cần 1 nước nữa có thể ngta thắng trước nên trả về winGuarantee
          if (blocks == 0) return winGuarantee;
          // khả năng bị chặn 2 đầu cao
          else return winGuarantee / 4;
        }
      }
      case 3: {
        // nếu là lượt người chơi -> đánh 4 con tạo cơ hội thắng cao , có thể bị ngta thắng trước
        if (blocks == 0) {
          if (currentPlayer) return 50000;
          // nếu đã bị chặn thì khó thắng
          else return 200;
        } else {
          // 3 con mà bị chặn thì ko nhiều ý nghĩa
          if (currPlayerTurn) return 20;
          else return 5;
        }
      }
      case 2: {
        if (blocks == 0) {
          if (currentPlayer) return 7;
          else return 5;
        } else return 3;
      }
      case 1: {
        return 1;
      }
    }
    // dự trù, sẽ luôn đảm bảo thuật toán sẽ trả về giá trị trong switch - case
    return 0;
  }
}

// note các lưu ý cải tiến
// + loại bỏ tham số bảng khi truyền vào các chương trình con
// + giới hạn số ô sẽ đánh ( chỉ đánh vào các ô trống gần ô đã được đánh) : xây dựng đánh 1 ô có XO liền kề
//  ( chỉ cần xây dựng 1 ô liền kề thôi, vấn đề 2 ô sẽ được loại bỏ khi máy đánh thử nước tiếp theo)
// + giới hạn độ sâu ( depth == 3);
// +* xây dựng hàm đánh giá nước đi

// +* xây dựng hàm lưu lại trạng thái của bảng, nếu có trùng trả thái thì trả về giá trị hiện có
