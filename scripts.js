const character = document.getElementById("character");
const game = document.getElementById("game");
let interval;
let both = 0;
let counter = 0;
let currentBlocks = [];
let highScore = localStorage.getItem("rogdrop_high_score");

if (!highScore) highScore = 0;

var highScoreCount = document.getElementById("high_score");
highScoreCount.innerHTML = highScore;

function moveLeft() {
  const left = parseInt(
    window.getComputedStyle(character).getPropertyValue("left")
  );
  if (left > 0) {
    character.style.left = left - 2 + "px";
  }
}

function moveRight() {
  const left = parseInt(
    window.getComputedStyle(character).getPropertyValue("left")
  );
  if (left < 380) {
    character.style.left = left + 2 + "px";
  }
}

function endGame() {
  const body = document.getElementsByTagName("BODY")[0];
  const endScreen = document.createElement("div");
  endScreen.setAttribute("id", "end_screen");
  const gameOver = document.createElement("h2");
  gameOver.setAttribute("id", "game_over");
  gameOver.innerHTML = "Game Over";
  endScreen.appendChild(gameOver);
  if (counter - 9 > highScore) {
    localStorage.setItem("rogdrop_high_score", counter - 9);
    const highScoreMessage = document.createElement("h2");
    highScoreMessage.setAttribute("id", "high_score_message");
    highScoreMessage.innerHTML = "New High Score";
    endScreen.appendChild(highScoreMessage);
  }
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", resetGame);
  endScreen.appendChild(resetButton);
  body.appendChild(endScreen);
}

function resetGame() {
  location.reload();
}

document.addEventListener("keydown", (event) => {
  if (both === 0) {
    both++;
    if (event.key === "ArrowLeft") {
      interval = setInterval(moveLeft, 1);
    }
    if (event.key === "ArrowRight") {
      interval = setInterval(moveRight, 1);
    }
  }
});

document.addEventListener("keyup", (event) => {
  clearInterval(interval);
  both = 0;
});

var blocks = setInterval(function () {
  var blockLast = document.getElementById("block" + (counter - 1));
  var holeLast = document.getElementById("hole" + (counter - 1));
  if (counter > 0) {
    var blockLastTop = parseInt(
      window.getComputedStyle(blockLast).getPropertyValue("top")
    );
    var holeLastTop = parseInt(
      window.getComputedStyle(holeLast).getPropertyValue("top")
    );
  }
  if (blockLastTop < 400 || counter === 0) {
    var block = document.createElement("div");
    var hole = document.createElement("div");
    block.setAttribute("class", "block");
    hole.setAttribute("class", "hole");
    block.setAttribute("id", "block" + counter);
    hole.setAttribute("id", "hole" + counter);
    block.style.top = blockLastTop + 60 + "px";
    hole.style.top = holeLastTop + 60 + "px";

    var random = Math.floor(Math.random() * 360);
    hole.style.left = random + "px";
    game.appendChild(block);
    game.appendChild(hole);
    currentBlocks.push(counter);
    counter++;
  }

  var characterTop = parseInt(
    window.getComputedStyle(character).getPropertyValue("top")
  );
  var characterLeft = parseInt(
    window.getComputedStyle(character).getPropertyValue("left")
  );
  var drop = 0;
  if (characterTop < 0.5) {
    clearInterval(blocks);
    endGame();

    // window.alert("Game Over. Score: " + (counter - 9));
    //location.reload();
  }

  for (var i = 0; i < currentBlocks.length; i++) {
    var current = currentBlocks[i];
    var iblock = document.getElementById("block" + current);
    var ihole = document.getElementById("hole" + current);
    var score = document.getElementById("score");

    var iblockTop = parseFloat(
      window.getComputedStyle(iblock).getPropertyValue("top")
    );
    var iholeLeft = parseFloat(
      window.getComputedStyle(ihole).getPropertyValue("left")
    );
    iblock.style.top = iblockTop - 0.5 + "px";
    ihole.style.top = iblockTop - 0.5 + "px";
    if (iblockTop < -20) {
      currentBlocks.shift();
      iblock.remove();
      ihole.remove();
    }

    if (iblockTop - 20 < characterTop && iblockTop > characterTop) {
      drop++;
      if (iholeLeft < characterLeft && iholeLeft + 20 > characterLeft) {
        drop = 0;
      }
    }
  }

  if (drop === 0) {
    if (characterTop < 400) {
      character.style.top = characterTop + 2 + "px";
      if (counter - 9 < 0) {
        score.innerHTML = 0;
      } else {
        score.innerHTML = counter - 9;
      }
    }
  } else {
    character.style.top = characterTop - 0.5 + "px";
  }
}, 1);
