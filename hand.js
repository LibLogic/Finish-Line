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
  let handCenter = [];
  // lets generate the two ends first then
  // insert the remaining cards into the middle
  for (let i = 0; i < 6; i++) {
    hand.push(drawCard(4, 15));
  }
  // Generate and insert middle
  let deckSize = deck.length;
  for (let i = 0; i < deckSize; i++) {
    handCenter.push(drawCard());
  }
  hand.splice(3, 0, ...handCenter);
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

function renderEmptyBoard() {
  let playerRow = "";
  let handStr = "";
  playerRow += `<ul class="p">`;
  players.forEach((player, i) => {
    playerRow += `<li class="li p${i + 1}"></li>`;
  });
  playerRow += `</ul>`;

  unicodeHand.forEach((card, i) => {
    if (card > 127152 && card < 127184) {
      handStr += `<div class="container${i}"><div class="card red">${String.fromCodePoint(
        card
      )}</div>${playerRow}</div>`;
    } else {
      handStr += `<div class="container${i}"><div class="card black">${String.fromCodePoint(
        card
      )}</div>${playerRow}</div>`;
    }
  });

  let cards = document.getElementById("hand");
  cards.innerHTML = handStr;
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
    getPlayerNames();
  }
});

let markers = document.querySelector(".markers");
markers.classList.add("hidden");

let selectedMarkerCount = 0;
let dieChoiceValue = 0;
// let currentPlayer = 0;
document.getElementById("red-marker").addEventListener("click", redMarkerClick);
function redMarkerClick({ target }) {
  let markerChoice = "red";
  selectedMarkerCount++;
  if (selectedMarkerCount === 2) {
    sentence.classList.add("hidden");
    markers.classList.add("hidden");
    btn2.classList.remove("hidden");
    document.querySelector(".black-die").classList.add("dim");
    document.querySelector(".red-die").classList.add("dim");
    dieChoiceValue =
      dieChoiceValue === num1 + num2 + 2
        ? num1 + num2 + 2
        : num1 + num2 + 2 - dieChoiceValue;
    document.querySelectorAll(`.player${currentPlayer}`).forEach(player => {
      player.classList.remove("highlight");
    });
    document.querySelectorAll(`.p${currentPlayer + 1}`).forEach(row => {
      row.classList.remove("highlight2");
    });
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % players.length;
    fillSpaces();
  } else {
    movePlayer(dieChoiceValue, markerChoice);
    fillSpaces();
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
    sentence.classList.add("hidden");
    markers.classList.add("hidden");
    btn2.classList.remove("hidden");
    document.querySelector(".black-die").classList.add("dim");
    document.querySelector(".red-die").classList.add("dim");
    dieChoiceValue =
      dieChoiceValue === num1 + num2 + 2
        ? num1 + num2 + 2
        : num1 + num2 + 2 - dieChoiceValue;
    document.querySelectorAll(`.player${currentPlayer}`).forEach(player => {
      player.classList.remove("highlight");
    });
    document.querySelectorAll(`.p${currentPlayer + 1}`).forEach(row => {
      row.classList.remove("highlight2");
    });
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % players.length;
    fillSpaces();
  } else {
    movePlayer(dieChoiceValue, markerChoice);
    fillSpaces();
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
    sentence.classList.add("hidden");
    markers.classList.add("hidden");
    btn2.classList.remove("hidden");
    document.querySelector(".black-die").classList.add("dim");
    document.querySelector(".red-die").classList.add("dim");
    dieChoiceValue =
      dieChoiceValue === num1 + num2 + 2
        ? num1 + num2 + 2
        : num1 + num2 + 2 - dieChoiceValue;
    document.querySelectorAll(`.player${currentPlayer}`).forEach(player => {
      player.classList.remove("highlight");
    });
    document.querySelectorAll(`.p${currentPlayer + 1}`).forEach(row => {
      row.classList.remove("highlight2");
    });
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % players.length;
    fillSpaces();
  } else {
    movePlayer(dieChoiceValue, markerChoice);
    fillSpaces();
  }
  target.classList.add("hidden");
  sentence.innerHTML = prompts[3];
}

let sentence = document.getElementById("content");

let diceDiv = document.getElementById("dice");

let btn1 = document.getElementById("btn1");

let playersDiv = document.getElementById("players-names");

btn1.addEventListener("click", () => {
  sentence.innerHTML = prompts[0];
  sentence.classList.remove("hidden");
  playersDiv.classList.remove("hidden");
  btn1.classList.add("hidden");
});

let btn2 = document.getElementById("btn2");
btn2.addEventListener("click", () => {
  diceDiv.classList.remove("hidden");
});

function movePlayer(dieMove, markerChoice) {
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
  let currentCard = 0;
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
      console.log("a");
      break;
    }
    stopValue = num1 + num2 + 2;
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
    currentCard = (hand[i] % 100) % 14;
    if (currentCard < stopValue) {
      if (moveCount >= dieMove) {
        console.log("b stopped by die value");
        players[currentPlayer][markerToMove]++;
        break;
      }
      console.log("c never stops here?");
      players[currentPlayer][markerToMove]++;
    } else {
      console.log("d stopped by card value first");
      players[currentPlayer][markerToMove]++;
      break;
    }
  }

  //check status if good do nothng else come back with previousMarkerPosition
  checkMarkerStatus(dieMove, previousMarkerPosition, currentCard, wingCards);
  // checkMarkerStatus(stopValue, dieMove, moveCount, previousMarkerPosition);
  renderEmptyBoard();
}

function fillSpaces() {
  document.querySelectorAll(`.player${currentPlayer}`).forEach(player => {
    player.classList.add("highlight");
  });

  document.querySelectorAll(`.p${currentPlayer + 1}`).forEach(row => {
    row.classList.add("highlight2");
  });

  let spaces;
  let row = "";
  for (let i = 0; i < players.length; i++) {
    switch (i) {
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
    spaces = document.querySelectorAll(row);
    if (players[i].markerAPos > -1) {
      spaces[
        players[i].markerAPos
      ].innerHTML += `<span style="color: tomato">•</span>`;
    }
    if (players[i].markerBPos > -1) {
      spaces[
        players[i].markerBPos
      ].innerHTML += `<span style="color: mediumseagreen">•</span>`;
    }
    if (players[i].markerCPos > -1) {
      spaces[
        players[i].markerCPos
      ].innerHTML += `<span style="color: mediumpurple">•</span>`;
    }
  }
}

function checkMarkerStatus(
  dieMove,
  previousMarkerPosition,
  currentCard,
  wingCards
) {
  let handLength = hand.length - 1;

  // first do all the things that should just return
  // remember moves have already been made, just not displayed yet
  if (players[currentPlayer][markerToMove] < handLength) {
    checkActivation(currentCard, wingCards);
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

function checkActivation(currentCard, wingCards) {
  let isSafety = false;
  let activatedCard = false;
  console.log(currentCard, "currentCard", wingCards);
  let activationCards = [13, 12, 11, 1, 2];
  activationCards.forEach(activationCard => {
    if (currentCard === activationCard) {
      activatedCard = currentCard;
      isSafety = wingCards.some(wingCard => {
        return activatedCard === wingCard;
      });
    }
  });
  if (isSafety === true) {
    alert("activation card is " + activatedCard + " but it is a safety card");
  } else if (activatedCard) {
    alert("activation card is " + activatedCard);
  }
}

function checkForAttack() {
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
      alert("Attacks detected on markers " + collisions);
    }
  }
}

let playersInfo = "";
function getPlayerNames() {
  document
    .getElementById("bg-image")
    .setAttribute("style", "background-image: url(./dice2.jpg)");
  document
    .getElementById("hand")
    .setAttribute("style", "background-color: #fff;");
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

  playersDiv.classList.add("hidden");
  document.getElementById("content").classList.add("hidden");

  let dice1 = dieStr[(num1 = 3)];
  let dice2 = dieStr[(num2 = 4)];
  dice =
    '<div class="red-die dim">' +
    dice1 +
    '</div><div class="bullet dim">•</div><div class="black-die dim">' +
    dice2 +
    "</div>";
  diceDiv.innerHTML = dice;

  document.querySelector(".red-die").classList.add("dim");
  document.querySelector(".black-die").classList.add("dim");
  document.querySelector(".bullet").classList.add("dim");

  btn2.classList.remove("hidden");
  renderPlayers();
  renderEmptyBoard();
}

function rollDice() {
  selectedMarkerCount = 0;

  document.getElementById("red-marker").classList.remove("hidden");
  document.getElementById("blue-marker").classList.remove("hidden");
  document.getElementById("green-marker").classList.remove("hidden");

  num1 = Math.floor(Math.random() * 6);
  let dice1 = dieStr[num1];
  num2 = Math.floor(Math.random() * 6);
  let dice2 = dieStr[num2];
  dice =
    '<div class="red-die">' +
    dice1 +
    '</div><div class="bullet">•</div><div class="black-die">' +
    dice2 +
    "</div>";

  diceDiv.innerHTML = dice;

  btn2.classList.add("hidden");

  sentence.innerHTML = prompts[2];
  sentence.classList.remove("hidden");

  let red = document.querySelector(".red-die");
  red.addEventListener("click", redDieClick);

  let black = document.querySelector(".black-die");
  black.addEventListener("click", blackDieClick);

  let green = document.querySelector(".bullet");
  green.addEventListener("click", bulletClick);

  function bulletClick() {
    dieChoiceValue = num1 + num2 + 2;
    selectedMarkerCount = 1;

    sentence.innerHTML = prompts[1];
    sentence.classList.remove("hidden");

    markers.classList.remove("hidden");

    green.removeEventListener("click", bulletClick);
    red.removeEventListener("click", redDieClick);
    black.removeEventListener("click", blackDieClick);
    green.classList.add("dim");
    red.classList.add("dim");
    black.classList.add("dim");
  }

  function redDieClick() {
    dieChoiceValue = num1 + 1;
    selectedMarkerCount = 0;
    if (selectedMarkerCount == 2) {
      sentence.innerHTML = prompts[3];
      sentence.classList.remove("hidden");
    } else {
      sentence.innerHTML = prompts[1];
      sentence.classList.remove("hidden");
      markers.classList.remove("hidden");
    }
    red.removeEventListener("click", redDieClick);
    black.removeEventListener("click", blackDieClick);
    green.removeEventListener("click", bulletClick);
    red.classList.add("dim");
    green.classList.add("dim");
  }

  function blackDieClick() {
    dieChoiceValue = num2 + 1;
    selectedMarkerCount = 0;
    if (selectedMarkerCount == 2) {
      sentence.innerHTML = prompts[3];
      sentence.classList.remove("hidden");
    } else {
      sentence.innerHTML = prompts[1];
      sentence.classList.remove("hidden");
      markers.classList.remove("hidden");
    }
    red.removeEventListener("click", redDieClick);
    black.removeEventListener("click", blackDieClick);
    green.removeEventListener("click", bulletClick);
    black.classList.add("dim");
    green.classList.add("dim");
  }
}
