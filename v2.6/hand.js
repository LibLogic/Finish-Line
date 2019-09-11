let deck = [],
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
  let placeHolder = document.getElementById("player-names");
  let dummy = "";
  for (let i = 0; i < 7; i++) {
    if (players.length < 3) {
      dummy += `<div id="place-holder" class="container"><div id="dummy" class="card">${String.fromCodePoint(
        127153
      )}</div><ul class="d"><li>${players[0].name}</li><li>${
        players[1].name
      }</li></ul></div>`;
    } else if (players.length > 2) {
      dummy += `<div id="place-holder" class="container"><div id="dummy" class="card">${String.fromCodePoint(
        127153
      )}</div><ul class="d"><li>${players[0].name}</li><li>${
        players[1].name
      }</li><li>${players[2].name}</li><li>${players[3].name}</li></ul></div>`;
    }
  }
  placeHolder.innerHTML = dummy;
}

let playerRow = "";
function createPlayerRow() {
  if (players.length > 2) {
    playerRow = `<ul class="p"><li class="li p1"></li><li class="li p2"></li><li class="li p3"></li><li class="li p4"></li></ul>`;
  } else if (players.length < 3) {
    playerRow = `<ul class="p"><li class="li p1"></li><li class="li p2"></li></ul>`;
  }
  return playerRow;
}

function renderBoard() {
  let handStr = "";
  unicodeHand.forEach(card => {
    playerRow = createPlayerRow();
    if (card > 127152 && card < 127184) {
      handStr += `<div class="container"><div class="card red">${String.fromCodePoint(
        card
      )}</div>${playerRow}</div>`;
    } else {
      handStr += `<div class="container"><div class="card black">${String.fromCodePoint(
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

let markers = document.querySelector(".markers");
markers.classList.add("hidden");

let selectedMarkerCount = 0;
let dieChoiceValue = 0;
let currentPlayer = 0;
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
    // console.log(num1 + 1, num2 + 1);
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % 4;
  } else {
    movePlayer(dieChoiceValue, markerChoice);
  }
  // alert(markerChoice + " " + dieChoiceValue + " " + currentPlayer);
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
    // console.log(num1 + 1, num2 + 1);
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % 4;
  } else {
    movePlayer(dieChoiceValue, markerChoice);
  }
  // alert(markerChoice + " " + dieChoiceValue + " " + currentPlayer);
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
    movePlayer(dieChoiceValue, markerChoice);
    ++currentPlayer;
    currentPlayer = currentPlayer % 4;
  } else {
    movePlayer(dieChoiceValue, markerChoice);
  }
  // alert(markerChoice + " " + dieChoiceValue + " " + currentPlayer);
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
  let markerToMove = "";
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

  for (let i = players[currentPlayer][markerToMove] + 1; i < hand.length; i++) {
    if (hand[i] % 100 < dieMove) {
      players[currentPlayer][markerToMove]++;
    } else {
      players[currentPlayer][markerToMove]++;
      break;
    }
  }
  // console.log(players[currentPlayer][markerToMove], "FMpos");

  createPlayerRow();
  renderBoard();
  // console.log("Board Cleared");
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
    // console.log(players[i].markerAPos, "Mpos");
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

let playersInfo = "";
function getPlayerNames() {
  document
    .getElementById("bg-image")
    .setAttribute("style", "background-image: url(./dice2.jpg)");
  document
    .getElementById("hand")
    .setAttribute("style", "background-color: #fff;");
  playersInfo = document.getElementById("players").value;
  playerStr = playersInfo.split(",");

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
      // let username = "player" + (i + 1);
      new Player(playerStr[i]);
    }
  })();

  // players[0] === undefined ? (players[0] = "——") : null;
  // players[1] === undefined ? (players[1] = "——") : null;
  // if (players.length > 2) {
  //   players[2] === undefined ? (players[2] = "——") : null;
  //   players[3] === undefined ? (players[3] = "——") : null;
  // }
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
  renderBoard();
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
    // alert(selectedMarkerCount + " black die selected " + (num2 + 1));
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
