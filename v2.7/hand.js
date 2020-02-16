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
let specialCards = [13, 12, 11, 1, 2];
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

function markerEvents() {
  document
    .getElementById("green-marker")
    .addEventListener("click", markerClick);
  document.getElementById("red-marker").addEventListener("click", markerClick);
  document.getElementById("blue-marker").addEventListener("click", markerClick);
}

let movesRemaining = 2;
let firstDieValue = 0;
let secondDieValue = 0;
function markerClick({ target }) {
  let markerChoice = target.id;
  console.clear();
  sortOpponentMarkers(players);
  movesRemaining--;
  if (movesRemaining === 0) {
    movePlayer(secondDieValue, markerChoice);
    updateMarkers();
    showRollView();
  } else {
    movePlayer(firstDieValue, markerChoice);
    updateMarkers();
  }
  target.classList.add("hidden");
  sentence.innerHTML = prompts[3];
}

function showRollView() {
  console.log("running showRollView");
  displayMarkers();
  sentence.classList.add("hidden");
  document.querySelector(".markers").classList.add("hidden");
  document.querySelector(".black-die").classList.add("dim");
  document.querySelector(".red-die").classList.add("dim");
  document.querySelector(".bullet").classList.add("dim");
  document.getElementById("rollBtn").classList.remove("hidden");
}

function switchUser() {
  userCards = [];
  console.log("running switchUser");
  ++currentPlayer;
  currentPlayer = currentPlayer % players.length;
  movesRemaining = 2;

  // need to keep this from running when we activate cards
  rollBtn.innerHTML = `${players[currentPlayer].name}<br/>Roll The Dice`;

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

let sentence = document.getElementById("prompts");

let diceContainer = document.getElementById("dice");

let beginBtn = document.getElementById("begin-btn");

let playersNames = document.getElementById("players-names");

beginBtn.addEventListener("click", () => {
  sentence.innerHTML = prompts[0];
  sentence.classList.remove("hidden");
  playersNames.classList.remove("hidden");
  beginBtn.classList.add("hidden");
});

function movePlayer(dieMove, markerChoice) {
  switch (markerChoice) {
    case "red-marker":
      markerToMove = "markerAPos";
      break;
    case "green-marker":
      markerToMove = "markerBPos";
      break;
    case "blue-marker":
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
      break;
    }
    stopValue = redDieValue + blackDieValue + 2;
    moveCount++;
    // console.clear();
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
        players[currentPlayer][markerToMove]++;
        break;
      }
      players[currentPlayer][markerToMove]++;
    } else {
      players[currentPlayer][markerToMove]++;
      break;
    }
  }

  //check status if good do nothng else come back with previousMarkerPosition
  checkMarkerStatus(dieMove, previousMarkerPosition, currentCard);
}

function updateMarkers() {
  console.log("running updateMarkers");
  players.forEach((player, playerIndex) => {
    let row = "";
    switch (playerIndex) {
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

    document.querySelectorAll(`.p${playerIndex + 1}`).forEach(li => {
      li.innerHTML = "";
    });

    spaces = document.querySelectorAll(row);
    if (players[playerIndex].markerAPos > -1) {
      spaces[
        players[playerIndex].markerAPos
      ].innerHTML += `<span style="color: tomato">•</span>`;
    }
    if (players[playerIndex].markerBPos > -1) {
      spaces[
        players[playerIndex].markerBPos
      ].innerHTML += `<span style="color: mediumseagreen">•</span>`;
    }
    if (players[playerIndex].markerCPos > -1) {
      spaces[
        players[playerIndex].markerCPos
      ].innerHTML += `<span style="color: mediumpurple">•</span>`;
    }
    if (specialCardFlag === false && movesRemaining < 1) {
      switchUser();
    }
  });
  console.log(players);
}

function checkMarkerStatus(dieMove, previousMarkerPosition, currentCard) {
  let handLength = hand.length - 1;
  // first do all the things that should just return
  // remember moves have already been made, just not displayed yet
  if (players[currentPlayer][markerToMove] < handLength) {
    getSpecialCards(currentCard);

    if (userCards.length > 0 && movesRemaining < 1) {
      processSpecialCards();
    }

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
  currentCardValue = (currentCard % 100) % 14;
  specialCards.forEach(specialCard => {
    if (currentCardValue === specialCard) {
      userCards.push(currentCard);
    }
  });
}

let specialCardFlag = false;
let furthestMarker = "";
function processSpecialCards() {
  console.log("processSpecialCards");
  rollBtn.removeEventListener("click", rollBtnClick);
  rollBtn.innerHTML = `${players[currentPlayer].name} Has Special Card(s)<br/>Roll For Activation`;
  rollBtn.addEventListener("click", specialBtnClick, { once: true });

  function specialBtnClick() {
    console.log(userCards, "special btn event 1");

    rollBtn.removeEventListener("click", pauseBtnClick);
    rollBtn.removeEventListener("click", specialBtnClick, { once: true });
    specialCardRoll();
    decideActivation();
    document.querySelector(".bullet").classList.add("dim");
    rollBtn.innerHTML = `Ok`;
    rollBtn.addEventListener("click", pauseBtnClick);
  }

  function pauseBtnClick() {
    sentence.classList.add("hidden");
    rollBtn.removeEventListener("click", pauseBtnClick);
    rollBtn.removeEventListener("click", specialBtnClick, { once: true });
    userCards.forEach((card, i) => {
      if (card === furthestSpecialCard) {
        userCards.splice(i, 1);
      }
    });
    document.querySelector(".black-die").classList.add("dim");
    document.querySelector(".red-die").classList.add("dim");
    if (userCards.length === 0) {
      showRollView();
      switchUser();
      rollBtn.addEventListener("click", rollBtnClick);
      specialCardFlag = false;
    } else {
      if (userCards.length > 0 && movesRemaining < 1) {
        processSpecialCards();
      }
    }
  }

  furthestSpecialCard = getFurthestSpecialCard();
  let furthestCardColor =
    Math.floor(furthestSpecialCard / 100) === 2 ||
    Math.floor(furthestSpecialCard / 100) === 3
      ? "red"
      : "black";

  function decideActivation() {
    console.log("decideActivation");
    let winningDieColor = "neither";
    if (blackDieValue + 1 > redDieValue + 1) {
      winningDieColor = "black";
    } else if (blackDieValue + 1 < redDieValue + 1) {
      winningDieColor = "red";
    }

    if (winningDieColor === furthestCardColor) {
      applyPenalty(furthestMarker, winningDieColor);
    } else {
      sentence.innerHTML = `Card not activated<br>${furthestCardColor.toUpperCase()} die didn't win.`;
      sentence.classList.remove("hidden");
    }
  }

  function getFurthestSpecialCard() {
    let furthestMarkerEntry = ["", -1];
    let playerEntries = Object.entries(players[currentPlayer]);
    for (const [marker, position] of playerEntries) {
      if (userCards.includes(hand[players[currentPlayer][marker]])) {
        if (position > furthestMarkerEntry[1]) {
          furthestMarkerEntry = [marker, position];
        }
        furthestMarker = furthestMarkerEntry[0];
      }
    }

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
    let furthestCardIndex = Math.max(posA, posB, posC);
    let furthestSpecialCard = hand[furthestCardIndex];
    return furthestSpecialCard;
  }

  if (userCards.length > 0) {
    specialCardFlag = true;
  }
}

function checkForAttack() {
  console.log("running checkForAttack");
  let collisions = [];
  for (var i = currentPlayer + 1; i !== currentPlayer; i++) {
    i = i % players.length;
    if (i === currentPlayer) {
      break;
    }
    players[currentPlayer][markerToMove] === players[i].markerAPos
      ? collisions.push(`Red marker `)
      : collisions;
    players[currentPlayer][markerToMove] === players[i].markerBPos
      ? collisions.push(`Green marker `)
      : collisions;
    players[currentPlayer][markerToMove] === players[i].markerCPos
      ? collisions.push(`Blue marker `)
      : collisions;
  }
  // if (collisions.length > 0) {
  //   alert(`You are attacking ${players[i].name}'s ${collisions}`);
  // }
}

function initializePage() {
  document.querySelector(".show-header").addEventListener("mouseenter", () => {
    document.querySelector(".show-header").setAttribute("style", "opacity: 1");
  });
  document.querySelector(".show-header").addEventListener("mouseleave", () => {
    document.querySelector(".show-header").setAttribute("style", "opacity: .8");
  });

  document
    .getElementById("bg-image")
    .setAttribute("style", "background-image: url(/images/dice2.jpg)");
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
  diceContainer.innerHTML = dice;

  getPlayerNames();

  document
    .getElementById("dice")
    .insertAdjacentHTML(
      "afterend",
      `<button id="rollBtn" class="btn">${players[currentPlayer].name}<br/>Roll The Dice</button>`
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

  playersNames.classList.add("hidden");
  document.getElementById("prompts").classList.add("hidden");

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

  diceContainer.innerHTML = dice;
  document.querySelector(".black-die").classList.remove("dim");
  document.querySelector(".red-die").classList.remove("dim");
}

function applyPenalty(furthestMarker, winningDieColor) {
  console.log("running applyPenalty");

  console.log(hand[players[currentPlayer][furthestMarker]] % 100);

  let markerPos = players[currentPlayer][furthestMarker];
  let markerIndex = (markerPos % 9) + 1;
  let forwardSpacesToMove = 18 - markerIndex * 2;
  let backwardSpacesToMove = markerIndex * 2;
  let card = hand[players[currentPlayer][furthestMarker]] % 100;
  switch (card) {
    case 13:
      ladder();
      break;
    case 12:
      pullForwards();
      break;
    case 11:
      pushBackwards();
      break;
    case 1:
      chute();
      break;
    case 2:
      swap();
      break;
    default:
      console.log("unknown penalty type");
  }

  function ladder() {
    sentence.innerHTML = `Card activated, ${winningDieColor.toUpperCase()} die won.<br>
    LADDER was applied`;
    sentence.classList.remove("hidden");
    players[currentPlayer][furthestMarker] += forwardSpacesToMove;
    players[currentPlayer][furthestMarker] =
      players[currentPlayer][furthestMarker] > hand.length - 1
        ? hand.length - 1
        : players[currentPlayer][furthestMarker];
    updateMarkers();
  }

  function pullForwards() {
    sentence.innerHTML = `Card activated, ${winningDieColor.toUpperCase()} die won.<br>
    PULL FORWARDS was applied`;
    sentence.classList.remove("hidden");
    currentPosition = players[currentPlayer][furthestMarker];
    let sortedMarkers = sortPlayerMarkers();
    let markerToMove = sortedMarkers.filter(marker => {
      return marker[3] < currentPosition;
    });
    if (markerToMove.length > 0) {
      markerToMove = markerToMove[0][2];
      players[currentPlayer][markerToMove] = currentPosition;
    }
    updateMarkers();
  }

  function pushBackwards() {
    sentence.innerHTML = `Card activated, ${winningDieColor.toUpperCase()} die won.<br>
    SEND BACK was applied`;
    sentence.classList.remove("hidden");

    currentPosition = players[currentPlayer][furthestMarker];
    let closestPlayer = [];
    let opponentIndex = 0;

    let sortedMarkers = sortOpponentMarkers(players);
    let markerList = sortedMarkers.filter(marker => {
      return marker[2] > currentPosition;
    });
    console.log(sortedMarkers, markerList);
    if (markerList.length > 0) {
      closestPlayer = markerList[markerList.length - 1];
      players.forEach((player, i) => {
        if (player.name === closestPlayer[0]) {
          opponentIndex = i;
        }
      });
      players[opponentIndex][closestPlayer[1]] = currentPosition;
      // alert("Pulling " + players[opponentIndex].name + " back.");
      updateMarkers();
    } else {
      // alert(`Nobody to send back.`);
    }
  }

  function chute() {
    sentence.innerHTML = `Card activated, ${winningDieColor.toUpperCase()} die won.<br>
    CHUTE was applied`;
    sentence.classList.remove("hidden");
    players[currentPlayer][furthestMarker] -= backwardSpacesToMove;
    players[currentPlayer][furthestMarker] =
      players[currentPlayer][furthestMarker] < 0
        ? -1
        : players[currentPlayer][furthestMarker];
    updateMarkers();
  }

  function swap() {
    sentence.innerHTML = `Card activated, ${winningDieColor.toUpperCase()} die won.<br>
    SWAP was applied`;
    sentence.classList.remove("hidden");
    currentPosition = players[currentPlayer][furthestMarker];
    let opponentIndex = 0;
    let sortedMarkers = sortOpponentMarkers(players);
    let filteredMarkers = sortedMarkers.filter(player => {
      return !(player[2] === currentPosition || player[2] === -1);
    });
    let randomIndex = Math.floor(Math.random() * filteredMarkers.length);
    let randomPlayer = [];
    randomPlayer = filteredMarkers[randomIndex];
    if (filteredMarkers.length > 0) {
      players.forEach((player, i) => {
        if (player.name === randomPlayer[0]) {
          opponentIndex = i;
        }
      });
      players[currentPlayer][furthestMarker] =
        players[opponentIndex][randomPlayer[1]];
      players[opponentIndex][randomPlayer[1]] = currentPosition;
      // alert(
      //   `Swapping with ${players[opponentIndex].name}'s marker at position ${
      //     randomPlayer[2]
      //   }`
      // );
    } else {
      // alert("Nobody to swap with.");
    }
    updateMarkers();
  }
}

function rollDice() {
  console.log("running rollDice");
  movesRemaining = 2;

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

  diceContainer.innerHTML = dice;
  rollBtn.classList.add("hidden");
  displayMarkers();
  diceEvents();
}

function displayMarkers() {
  console.log("running displayMarkers");

  document
    .getElementById("green-marker")
    .removeEventListener("click", markerClick);
  document
    .getElementById("red-marker")
    .removeEventListener("click", markerClick);
  document
    .getElementById("blue-marker")
    .removeEventListener("click", markerClick);

  let visibleMarkerCount = 3;
  players[currentPlayer].markerAPos < hand.length - 1
    ? document.getElementById("red-marker").classList.remove("hidden")
    : (document.getElementById("red-marker").classList.add("hidden"),
      visibleMarkerCount--);

  players[currentPlayer].markerBPos < hand.length - 1
    ? document.getElementById("green-marker").classList.remove("hidden")
    : (document.getElementById("green-marker").classList.add("hidden"),
      visibleMarkerCount--);
  players[currentPlayer].markerCPos < hand.length - 1
    ? document.getElementById("blue-marker").classList.remove("hidden")
    : (document.getElementById("blue-marker").classList.add("hidden"),
      visibleMarkerCount--);

  if (visibleMarkerCount < 2) {
    movesRemaining = 1;
  }
  document.querySelector(".markers").classList.remove("hidden");
}

function diceEvents() {
  sentence.innerHTML = prompts[2]; // select a die
  sentence.classList.remove("hidden");

  document.querySelector(".red-die").addEventListener("click", dieClick);
  document.querySelector(".black-die").addEventListener("click", dieClick);
  document.querySelector(".bullet").addEventListener("click", dieClick);
}

function dieClick({ target }) {
  if (target.className === "bullet") {
    secondDieValue = redDieValue + blackDieValue + 2;
    movesRemaining = 1;
    target.classList.add("dim");
    target.classList.add("dim");
    document.querySelector(".red-die").removeEventListener("click", dieClick);
    document.querySelector(".black-die").removeEventListener("click", dieClick);
  }
  if (target.className === "red-die") {
    firstDieValue = redDieValue + 1;
    secondDieValue = blackDieValue + 1;
    target.classList.add("dim");
    document.querySelector(".bullet").classList.add("dim");
    document.querySelector(".bullet").removeEventListener("click", dieClick);
    document.querySelector(".black-die").removeEventListener("click", dieClick);
  }
  if (target.className === "black-die") {
    firstDieValue = blackDieValue + 1;
    secondDieValue = redDieValue + 1;
    target.classList.add("dim");
    document.querySelector(".bullet").classList.add("dim");
    document.querySelector(".bullet").removeEventListener("click", dieClick);
    document.querySelector(".red-die").removeEventListener("click", dieClick);
  }
  sentence.innerHTML = prompts[1];
  sentence.classList.remove("hidden");
  target.removeEventListener("click", dieClick);
  target.classList.add("dim");
  markerEvents();
}

function sortOpponentMarkers(players) {
  updateMarkers();
  opponents = players.filter((player, i) => {
    return i !== currentPlayer;
  });
  let sorted = [];
  opponents.forEach(player => {
    for (let marker in player) {
      if (marker !== "name") {
        sorted.push([player.name, marker, player[marker]]);
      }
    }
    sorted.sort((b, a) => {
      return a[2] - b[2];
    });
  });
  return sorted;
}

function sortPlayerMarkers() {
  updateMarkers();
  let sorted = [];
  for (let marker in players[currentPlayer]) {
    if (!(marker === "name" || marker === "index")) {
      sorted.push([
        players[currentPlayer].index,
        players[currentPlayer].name,
        marker,
        players[currentPlayer][marker]
      ]);
    }
  }
  sorted.sort((b, a) => {
    return a[3] - b[3];
  });
  return sorted;
}
