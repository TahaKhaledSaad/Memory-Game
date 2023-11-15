let startBtn = document.querySelector(".control-buttons .container span");
let nameInput = document.querySelector(".control-buttons .container input");
let myName = document.querySelector(".info-container .name span");
//
let blocksContainer = document.querySelector(".memory-game-blocks");
let triesElement = document.querySelector(".info-container .tries span");
//
let leaderBoard = document.querySelector(".leader-board");

// Event To Display & Hide Window -Splash Screen-
startBtn.addEventListener("click", () => {
  // 1 --> Set The Name
  if (nameInput.value == null || nameInput.value == "") {
    myName.innerHTML = "Unknown";
  } else {
    myName.innerHTML = nameInput.value;
  }
  // 2 --> Hide The Window -Splash-
  document.querySelector(".control-buttons").remove();
  // 3 --> Play Background Sound
  document.querySelector("#bgsound").play();
  // 4 --> Play Timer Function
  countdown(150);
});

// Effect Duration
let duration = 1000;
// Create Array From Game Blocks
let blocks = Array.from(blocksContainer.children);
// Create Range Of Keys
let orderRange = [...Array(blocks.length).keys()];
// Wrong Tries
let wrongTries;

// Invoke Shuffle Function
shuffle(orderRange);

// Add Order CSS Property To Game Blocks
blocks.forEach((block, index) => {
  // 1
  block.style.order = orderRange[index];
  // 2
  block.addEventListener("click", () => {
    // 2.1
    flipBlock(block);
    // Task
    if (document.querySelectorAll(".has-match").length == blocks.length) {
      //
      storeValues(myName.innerHTML, triesElement.innerHTML);
      //
      leaderBoard.innerHTML = "";
      drawLeaderBoard();
      //
      document.querySelector(".success-popup").style.display = "flex";
    }
  });
});

// Click Event To Show Blocks And Hide Quickly
startBtn.addEventListener("click", () => {
  blocks.forEach((block) => {
    setTimeout(() => {
      block.classList.add("has-match");
    }, 300);
    setTimeout(() => {
      block.classList.remove("has-match");
    }, 1500);
  });
});

// Function: Flip Block
function flipBlock(selectedBlock) {
  // 1
  selectedBlock.classList.add("is-flipped");
  // 2
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );
  // 3 ---> If There Two Selected
  if (allFlippedBlocks.length === 2) {
    // 3.1
    stopClicking();
    // 3.2
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Function: Stop Clicking Function
function stopClicking() {
  // 1
  blocksContainer.classList.add("no-clicking");
  // 2
  setTimeout(() => {
    // Remove Class No Clicking After Duration
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// Function: Check Matched Block
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.image === secondBlock.dataset.image) {
    //
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
    //
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
    //
    document.getElementById("success").play();
  } else {
    //
    wrongTries = parseInt(triesElement.innerHTML) + 1;
    triesElement.innerHTML = wrongTries;
    //
    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
    //
    document.getElementById("fail").play();
  }
}

// Function: Shuffle (Main Idea From The Lesson)
function shuffle(array) {
  let current = array.length,
    temp,
    random;
  //
  while (current > 0) {
    // 1
    random = Math.floor(Math.random() * current);
    // 2
    current--;
    // 3 --> Step One In Shuffle
    temp = array[current];
    // 4 --> Step Two In Shuffle
    array[current] = array[random];
    // 5 --> Step Three In Shuffle
    array[random] = temp;
  }
  return array;
}

// *********************************
// *********** Tasks ***************
// *********************************

let arrayOfScores;
if (window.localStorage.getItem("arrayOfScores")) {
  arrayOfScores = JSON.parse(window.localStorage.getItem("arrayOfScores"));
  drawLeaderBoard();
} else {
  arrayOfScores = [];
}

function storeValues(roundName, roundWrongs) {
  let round = {
    rName: roundName,
    rWrongs: roundWrongs,
  };
  arrayOfScores.push(round);
  window.localStorage.setItem("arrayOfScores", JSON.stringify(arrayOfScores));
}

function drawLeaderBoard() {
  leaderBoard.innerHTML = `
      <div class="row header">
        <span>Name</span>
        <span>Wrong Tries</span>
      </div>
  `;
  let parseArray = JSON.parse(window.localStorage.getItem("arrayOfScores"));
  parseArray.forEach((score) => {
    let row = document.createElement("div");
    row.className = "row";
    let nameSpan = document.createElement("span");
    nameSpan.appendChild(document.createTextNode(score.rName));
    let wrongSpan = document.createElement("span");
    wrongSpan.appendChild(document.createTextNode(score.rWrongs));
    row.appendChild(nameSpan);
    row.appendChild(wrongSpan);
    leaderBoard.appendChild(row);
  });
}

// *********************************
// *********** Tasks ***************
// *********************************

let countdownElement = document.querySelector(".countdown");
let failPopup = document.querySelector(".fail-popup");

function countdown(duration) {
  let minutes, seconds;
  countdownInterval = setInterval(() => {
    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);
    //
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    //
    countdownElement.innerHTML = `${minutes}:${seconds}`;
    //
    if (
      (--duration < 0 && document.querySelectorAll(".has-match").length != blocks.length) ||
      triesElement.innerHTML > 10
    ) {
      clearInterval(countdownInterval);
      blocks.forEach((block) => {
        block.classList.add("has-match");
      });
      failPopup.style.display = "flex";
    }
    //
    if (--duration < 0 || triesElement.innerHTML > 10) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}
// *********************************
// *********** Tasks ***************
// *********************************
document.querySelector(".play-again").addEventListener("click", () => window.location.reload());
