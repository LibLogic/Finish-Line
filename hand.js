let currentPlayer = 0,
  deck = [],
  newHand = [],
  hand = [];

deck = createDeck(56);
deck.pop();
deck.pop();

hand = generateHand();

unicodeHand = hand.map(card => {
  card == 114 ? (card = 414) : card;
  let suit = Math.floor(card / 100);
  let cardValue = card % 100;
  let result = 127120;
  cardValue > 11 ? cardValue++ : cardValue;
  result = result + suit * 16 + cardValue;
  return result;
});

function createDeck(deckSize) {
  for (let i = 1; deck.length < deckSize; i++) {
    deck.push(100 + i); // clubs
    deck.push(200 + i); // diamonds
    deck.push(300 + i); // hearts
    deck.push(400 + i); // spades
  }
  return deck;
}

// Draw random cards from deck. Negates need to shuffle deck.
function drawCard(startPos = 0, fromEnd = deck.length) {
  fromEnd !== deck.length ? (fromEnd = deck.length - fromEnd) : fromEnd;
  let random = Math.floor(Math.random() * (fromEnd - startPos)) + startPos;
  let card = deck[random];
  deck.splice(random, 1);
  return card;
}

// Generate a "track" **Do not allow jack, queen, king, ace, or joker in either
// first 3 or last 3 marker Positions.
function generateHand() {
  let wings = [];
  // Generate wing cards first (excluding J, Q, K, A, or 2)
  for (let i = 0; i < 6; i++) {
    wings.push(drawCard(8, 14));
  }
  // Put a wing card at the end of each row (every 9th card)
  let deckSize = deck.length;
  for (let col = 0; col < 6; col++) {
    for (let row = 0; row < 8; row++) {
      hand.push(drawCard());
    }
    hand.push(wings.pop());
  }
  return hand;
}

// Array for six sided die
let dieStr = [
  String.fromCodePoint(9856),
  String.fromCodePoint(9857),
  String.fromCodePoint(9858),
  String.fromCodePoint(9859),
  String.fromCodePoint(9860),
  String.fromCodePoint(9861)
];

function renderPlayers() {
  let playerNames1 = document.querySelector(".player-names-left");
  let playerNames2 = document.querySelector(".player-names-right");
  let playerList = "";
  for (let i = 0; i < 6; i++) {
    playerList += `<div id="place-holder" class="container"><div id="dummy" class="card">${String.fromCodePoint(
      127153
    )}</div><ul class="d">`;
    players.forEach((player, i) => {
      playerList += `<li class="player${i}">${player.name}</li>`;
    });
    playerList += `</ul></div>`;
  }
  playerNames1.innerHTML = playerList;
  playerNames2.innerHTML = playerList;

  document.querySelectorAll(".player0").forEach(player => {
    player.classList.add("highlight");
  });
}

function renderBoard() {
  let handStr = "";
  unicodeHand.forEach((card, i) => {
    if (card > 127152 && card < 127184) {
      handStr += `<div class="marker-row container${i}"><div class="card red">${String.fromCodePoint(
        card
      )}</div></div>`;
    } else {
      handStr += `<div class="marker-row container${i}"><div class="card black">${String.fromCodePoint(
        card
      )}</div></div>`;
    }
  });

  let cards = document.getElementById("hand");
  cards.innerHTML = handStr;

  const elem = document.getElementById("scrollToBottom");
  elem.scroll(0, document.documentElement.scrollHeight);
}

let prompts = [
  `Enter a Comma Separated List of Players Names`,
  `Marker to Move?`,
  `Select a Die`,
  `Which Marker Now?`
];

let players = [];
document.getElementById("players").addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    initializePage();
  }
});

let markers = document.querySelector(".markers");
markers.classList.add("hidden");

let selectedMarkerCount = 0;
let dieChoiceValue = 0;
document.getElementById("red-marker").addEventListener("click", redMarkerClick);
function redMarkerClick({ target }) {
  let markerChoice = "red";
  selectedMarkerCount++;
  if (selectedMarkerCount === 2) {
    dieChoiceValue =
      dieChoiceValue === redDieValue + blackDieValue + 2
        ? redDieValue + blackDieValue + 2
        : redDieValue + blackDieValue + 2 - dieChoiceValue;
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % players.length;
    // switchUser();
    showRollView();
    updateMarkers();
  } else {
    movePlayer(dieChoiceValue, markerChoice);
    updateMarkers();
  }
  target.classList.add("hidden");
  sentence.innerHTML = prompts[3];
}

document
  .getElementById("green-marker")
  .addEventListener("click", greenMarkerClick);
function greenMarkerClick({ target }) {
  let markerChoice = "green";
  selectedMarkerCount++;
  if (selectedMarkerCount === 2) {
    dieChoiceValue =
      dieChoiceValue === redDieValue + blackDieValue + 2
        ? redDieValue + blackDieValue + 2
        : redDieValue + blackDieValue + 2 - dieChoiceValue;
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % players.length;
    // switchUser();
    showRollView();
    updateMarkers();
  } else {
    movePlayer(dieChoiceValue, markerChoice);
    updateMarkers();
  }
  target.classList.add("hidden");
  sentence.innerHTML = prompts[3];
}

document
  .getElementById("blue-marker")
  .addEventListener("click", blueMarkerClick);
function blueMarkerClick({ target }) {
  let markerChoice = "blue";
  selectedMarkerCount++;
  if (selectedMarkerCount === 2) {
    dieChoiceValue =
      dieChoiceValue === redDieValue + blackDieValue + 2
        ? redDieValue + blackDieValue + 2
        : redDieValue + blackDieValue + 2 - dieChoiceValue;
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % players.length;
    // switchUser();
    showRollView();
    updateMarkers();
  } else {
    movePlayer(dieChoiceValue, markerChoice);
    updateMarkers();
  }
  target.classList.add("hidden");
  sentence.innerHTML = prompts[3];
}

function showRollView() {
  sentence.classList.add("hidden");
  markers.classList.add("hidden");
  document.querySelector(".black-die").classList.add("dim");
  document.querySelector(".red-die").classList.add("dim");
  document.querySelector(".bullet").classList.add("dim");
  document.getElementById("rollBtn").classList.remove("hidden");
}

function switchUser() {
  console.log("running switchUser");

  // need to keep this from running when we activate cards
  rollBtn.innerHTML = `${players[currentPlayer].name}<br/>Roll The Dice x`;

  for (let i = 0; i < players.length; i++) {
    document.querySelectorAll(`.player${i}`).forEach(player => {
      player.classList.remove("highlight");
    });
    document.querySelectorAll(`.p${i + 1}`).forEach(row => {
      row.classList.remove("row-highlight");
    });
  }
  document.querySelectorAll(`.player${currentPlayer}`).forEach(player => {
    player.classList.add("highlight");
  });
  document.querySelectorAll(`.p${currentPlayer + 1}`).forEach(li => {
    li.classList.add("row-highlight");
  });
}

let sentence = document.getElementById("content");

let diceDiv = document.getElementById("dice");

let btn1 = document.getElementById("btn1");

let namesInputDiv = document.getElementById("players-names");

btn1.addEventListener("click", () => {
  sentence.innerHTML = prompts[0];
  sentence.classList.remove("hidden");
  namesInputDiv.classList.remove("hidden");
  btn1.classList.add("hidden");
});

function movePlayer(dieMove, markerChoice) {
  console.log("running movePlayer");
  switch (markerChoice) {
    case "red":
      markerToMove = "markerAPos";
      break;
    case "green":
      markerToMove = "markerBPos";
      break;
    case "blue":
      markerToMove = "markerCPos";
      break;
  }

  let moveCount = 0;
  let stopValue = 0;
  let currentCardValue = 0;
  let wingCards = [
    (hand[8] % 100) % 14,
    (hand[17] % 100) % 14,
    (hand[26] % 100) % 14,
    (hand[35] % 100) % 14,
    (hand[44] % 100) % 14,
    (hand[53] % 100) % 14
  ];
  let previousMarkerPosition = players[currentPlayer][markerToMove];
  for (let i = players[currentPlayer][markerToMove] + 1; i < hand.length; i++) {
    if (dieMove === 0) {
      console.log("dieMove was 0");
      break;
    }
    stopValue = redDieValue + blackDieValue + 2;
    moveCount++;
    console.clear();
    console.log(
      "Previous Marker position: ",
      previousMarkerPosition + 1,
      "\nCurrent player",
      players[currentPlayer].name,
      "\nMarker to move",
      markerToMove,
      "\nStop value",
      stopValue,
      "\nCurrent die value",
      dieMove,
      "\nMove count",
      moveCount
    );

    currentCard = hand[i];
    currentCardValue = (hand[i] % 100) % 14;

    if (currentCardValue < stopValue) {
      if (moveCount >= dieMove) {
        console.log("stopped by die value @ ", currentCardValue);
        players[currentPlayer][markerToMove]++;
        break;
      }
      console.log("increments here, but never stops here");
      players[currentPlayer][markerToMove]++;
    } else {
      console.log("stopped by card value first @ ", currentCardValue);
      players[currentPlayer][markerToMove]++;
      break;
    }
  }

  //check status if good do nothng else come back with previousMarkerPosition
  checkMarkerStatus(dieMove, previousMarkerPosition, currentCard);
  updateMarkers();
}

function updateMarkers() {
  console.log("running updateMarkers");
  let spaces;
  let row = "";
  // for (let i = 0; i < players.length; i++) {
  switch (currentPlayer) {
    case 0:
      row = ".p1";
      break;
    case 1:
      row = ".p2";
      break;
    case 2:
      row = ".p3";
      break;
    case 3:
      row = ".p4";
      break;
  }
  document.querySelectorAll(`.p${currentPlayer + 1} span`).forEach(li => {
    li.innerHTML = "";
  });

  spaces = document.querySelectorAll(row);
  if (players[currentPlayer].markerAPos > -1) {
    spaces[
      players[currentPlayer].markerAPos
    ].innerHTML += `<span style="color: tomato">•</span>`;
  }
  if (players[currentPlayer].markerBPos > -1) {
    spaces[
      players[currentPlayer].markerBPos
    ].innerHTML += `<span style="color: mediumseagreen">•</span>`;
  }
  if (players[currentPlayer].markerCPos > -1) {
    spaces[
      players[currentPlayer].markerCPos
    ].innerHTML += `<span style="color: mediumpurple">•</span>`;
  }

  console.log(specialCardFlag, selectedMarkerCount);

  console.log(specialCardFlag === false && selectedMarkerCount > 1);

  // maybe we can set a flag here?
  if (specialCardFlag === false && selectedMarkerCount > 1) {
    console.log("about to run switchUser");
    switchUser();
  }
}

function checkMarkerStatus(dieMove, previousMarkerPosition, currentCard) {
  console.log("running checkMarkerStatus");
  let handLength = hand.length - 1;
  // first do all the things that should just return
  // remember moves have already been made, just not displayed yet
  if (players[currentPlayer][markerToMove] < handLength) {
    getSpecialCards(currentCard);

    if (userCards.length > 0 && selectedMarkerCount > 1) {
      processSpecialCards();
    }
    //  else if (userCards.length === 0 && selectedMarkerCount > 1) {
    //   switchUser((flag = false));
    // }

    checkForAttack();
    return;
  }
  if (previousMarkerPosition + dieMove === handLength) {
    if (
      players[currentPlayer].markerAPos === handLength &&
      players[currentPlayer].markerBPos === handLength &&
      players[currentPlayer].markerCPos === handLength
    ) {
      alert(players[currentPlayer].name + " wins!");
      return;
    }
    alert("Your Marker Has Finished");
    return;
  } else {
    players[currentPlayer][markerToMove] = previousMarkerPosition;
    currentPlayer += players.length % players.length;
    alert("Move Not Allowed");
    return;
  }
}

let userCards = [];
function getSpecialCards(currentCard) {
  console.log("running getSpecialCards");

  let specialCards = [13, 12, 11, 1, 2];
  currentCardValue = (currentCard % 100) % 14;
  specialCards.forEach(specialCard => {
    if (currentCardValue === specialCard) {
      userCards.push(currentCard);
    }
  });
}

let specialCardFlag = false;
function processSpecialCards() {
  console.log("running processSpecialCards");
  console.log(userCards);
  let furthestSpecialCard = getFurthestCard();

  let furthestCardColor =
    Math.floor(furthestSpecialCard / 100) === 2 ||
    Math.floor(furthestSpecialCard / 100) === 3
      ? "red"
      : "black";

  console.log(
    furthestSpecialCard,
    furthestCardColor,
    "furthestSpecialCard, furthestCardColor"
  );

  rollBtn.removeEventListener("click", rollBtnClick);
  rollBtn.innerHTML = `${players[currentPlayer].name}<br/>Special Card(s)<br/>Activation Roll`;
  rollBtn.addEventListener(
    "click",
    function() {
      specialCardRoll();
      decideActivation();
      specialCardFlag = false;
    },
    { once: true }
  );

  function decideActivation() {
    console.log(
      furthestCardColor,
      "furthestCardColor — running decideActivation"
    );
    let winningDieColor = "neither";
    if (blackDieValue + 1 > redDieValue + 1) {
      winningDieColor = "black";
    } else if (blackDieValue + 1 < redDieValue + 1) {
      winningDieColor = "red";
    }
    console.log(
      redDieValue + 1,
      "r",
      blackDieValue + 1,
      "b",
      "<-die values",
      winningDieColor,
      furthestCardColor,
      "winningDieColor, furthestCardColor outside setTimeout"
    );

    if (winningDieColor === furthestCardColor) {
      console.log("Card has been activated " + winningDieColor + " die won");
      applyPenalty();
      rollBtn.removeEventListener("click", function() {
        specialCardRoll();
        decideActivation();
      });
      switchUser();
      // rollBtn.innerHTML = `${players[currentPlayer].name}<br/>Roll The Dice y`;
      rollBtn.addEventListener("click", rollBtnClick);
    } else {
      console.log("Sorry, card not activated " + winningDieColor + " die won");
      rollBtn.removeEventListener("click", function() {
        specialCardRoll();
        decideActivation();
      });
      switchUser();
      // rollBtn.innerHTML = `${players[currentPlayer].name}<br/>Roll The Dice z`;
      rollBtn.addEventListener("click", rollBtnClick);
    }
  }

  function getFurthestCard() {
    let posA = -1;
    let posB = -1;
    let posC = -1;
    if (userCards.includes(hand[players[currentPlayer].markerAPos])) {
      posA = players[currentPlayer].markerAPos;
    }
    if (userCards.includes(hand[players[currentPlayer].markerBPos])) {
      posB = players[currentPlayer].markerBPos;
    }
    if (userCards.includes(hand[players[currentPlayer].markerCPos])) {
      posC = players[currentPlayer].markerCPos;
    }
    let furthestSpecialIndex = Math.max(posA, posB, posC);
    let furthestSpecialCard = hand[furthestSpecialIndex];
    return furthestSpecialCard;
  }

  if (userCards.length > 0) {
    specialCardFlag = true;
  }

  // be sure to do this last //////////////////////////////
  if (selectedMarkerCount > 1) {
    userCards = [];
  }
  // be sure to do this last /////////////////////////////
}

function checkForAttack() {
  console.log("running checkForAttack");
  let collisions = [];
  for (let i = currentPlayer + 1; i !== currentPlayer; i++) {
    i = i % players.length;
    if (i === currentPlayer) {
      break;
    }
    players[currentPlayer][markerToMove] === players[i].markerAPos
      ? collisions.push("A")
      : collisions;
    players[currentPlayer][markerToMove] === players[i].markerBPos
      ? collisions.push("B")
      : collisions;
    players[currentPlayer][markerToMove] === players[i].markerCPos
      ? collisions.push("C")
      : collisions;
    if (collisions.length > 0) {
      // alert("Attacks detected on markers " + collisions);
    }
  }
}

function initializePage() {
  document
    .getElementById("bg-image")
    .setAttribute("style", "background-image: url(./dice2.jpg)");
  document
    .getElementById("hand")
    .setAttribute("style", "background-color: #fff;");

  let dice1 = dieStr[(redDieValue = 3)];
  let dice2 = dieStr[(blackDieValue = 4)];
  dice =
    '<div class="red-die dim">' +
    dice1 +
    '</div><div class="bullet dim">•</div><div class="black-die dim">' +
    dice2 +
    "</div>";
  diceDiv.innerHTML = dice;

  getPlayerNames();

  document
    .getElementById("dice")
    .insertAdjacentHTML(
      "afterend",
      `<button id="rollBtn" class="btn">${players[currentPlayer].name}<br/>Roll The Dice w</button>`
    );

  document.getElementById("rollBtn").addEventListener("click", rollBtnClick);
}

function rollBtnClick() {
  rollDice();
}

let playersInfo = "";
function getPlayerNames() {
  playersInfo = document.getElementById("players").value;
  playerStr = playersInfo.split(", ");

  class Player {
    constructor(name) {
      this.markerAPos = -1;
      this.markerBPos = -1;
      this.markerCPos = -1;
      this.name = name;
      players.push(this);
    }
  }

  (function() {
    for (let i = 0; i < playerStr.length; i++) {
      new Player(playerStr[i]);
    }
  })();

  namesInputDiv.classList.add("hidden");
  document.getElementById("content").classList.add("hidden");

  renderPlayers();
  renderBoard();

  let playerRow = "";
  playerRow += `<ul class="p">`;
  players.forEach((player, i) => {
    playerRow += `<li class="li p${i + 1}"></li>`;
  });
  playerRow += `</ul>`;

  document.querySelectorAll(".marker-row").forEach(li => {
    li.innerHTML += playerRow;
  });

  document.querySelectorAll(`.p1`).forEach(li => {
    li.classList.add("row-highlight");
  });
}

function specialCardRoll() {
  console.log("running specialCardRoll");
  redDieValue = Math.floor(Math.random() * 6);
  let dice1 = dieStr[redDieValue];
  blackDieValue = Math.floor(Math.random() * 6);
  let dice2 = dieStr[blackDieValue];
  dice =
    '<div class="red-die">' +
    dice1 +
    '</div><div class="bullet">•</div><div class="black-die">' +
    dice2 +
    "</div>";

  diceDiv.innerHTML = dice;
  document.querySelector(".black-die").classList.remove("dim");
  document.querySelector(".red-die").classList.remove("dim");
}

function applyPenalty() {
  alert("penalty applied");
}

function rollDice() {
  selectedMarkerCount = 0;

  document.getElementById("red-marker").classList.remove("hidden");
  document.getElementById("blue-marker").classList.remove("hidden");
  document.getElementById("green-marker").classList.remove("hidden");

  redDieValue = Math.floor(Math.random() * 6);
  let dice1 = dieStr[redDieValue];
  blackDieValue = Math.floor(Math.random() * 6);
  let dice2 = dieStr[blackDieValue];
  dice =
    '<div class="red-die">' +
    dice1 +
    '</div><div class="bullet">•</div><div class="black-die">' +
    dice2 +
    "</div>";

  diceDiv.innerHTML = dice;

  rollBtn.classList.add("hidden");

  sentence.innerHTML = prompts[2];
  sentence.classList.remove("hidden");

  let red = document.querySelector(".red-die");
  red.addEventListener("click", redDieClick);

  let black = document.querySelector(".black-die");
  black.addEventListener("click", blackDieClick);

  let green = document.querySelector(".bullet");
  green.addEventListener("click", bulletClick);

  function bulletClick() {
    dieChoiceValue = redDieValue + blackDieValue + 2;
    selectedMarkerCount = 1;

    sentence.innerHTML = prompts[1];
    sentence.classList.remove("hidden");
    markers.classList.remove("hidden");

    removeDieClick();
    red.classList.add("dim");
    black.classList.add("dim");
  }

  function redDieClick() {
    dieChoiceValue = redDieValue + 1;
    selectedMarkerCount = 0;
    if (selectedMarkerCount == 2) {
      sentence.innerHTML = prompts[3];
      sentence.classList.remove("hidden");
    } else {
      sentence.innerHTML = prompts[1];
      sentence.classList.remove("hidden");
      markers.classList.remove("hidden");
    }
    removeDieClick();
    red.classList.add("dim");
  }

  function blackDieClick() {
    dieChoiceValue = blackDieValue + 1;
    selectedMarkerCount = 0;
    if (selectedMarkerCount == 2) {
      sentence.innerHTML = prompts[3];
      sentence.classList.remove("hidden");
    } else {
      sentence.innerHTML = prompts[1];
      sentence.classList.remove("hidden");
      markers.classList.remove("hidden");
    }
    removeDieClick();
    black.classList.add("dim");
  }

  function removeDieClick() {
    red.removeEventListener("click", redDieClick);
    black.removeEventListener("click", blackDieClick);
    green.removeEventListener("click", bulletClick);
    green.classList.add("dim");
  }
}
