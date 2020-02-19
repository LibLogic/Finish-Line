let currentPlayer = 0,
  deck = [],
  newHand = [],
  hand = [],
  wings = [],
  jokerOnePosition = 0,
  jokerTwoPosition = 0,
  wingCardPositions = [-1, 8, 17, 26, 35, 44, 53];

deck = createDeck(56);
deck.pop();
deck.pop();

hand = generateHand();

safetyCardPositions = [
  ...wingCardPositions,
  jokerOnePosition,
  jokerTwoPosition
];

unicodeHand = hand.map(card => {
  card == 114 ? (card = 414) : card;
  let suit = Math.floor(card / 100);
  let cardValue = card % 100;
  let result = 127120;
  cardValue > 11 ? cardValue++ : cardValue;
  result = result + suit * 16 + cardValue;
  // result = result === 127167 ? 127199 : result; // fix for missing red joker on mac
    result = result === 127167 ? \u1f000 : result;
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

// Generate layout" **Do not allow jack, queen, king, ace, duece, or joker in either
// first 3 or last 3 marker Positions.
let specialCards = [14, 13, 12, 11, 1, 2];
function generateHand() {
  // Generate wing cards first (excluding J, Q, K, A, or 2)
  for (let i = 0; i < 6; i++) {
    wings.push(drawCard(8, 14));
  }
  // Put a wing card at the end of each row (every 9th card)
  // let deckSize = deck.length;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      let drawnCard = drawCard();
      hand.push(drawnCard);
      if (drawnCard === 114) {
        jokerOnePosition = hand.length - 1;
      }
      if (drawnCard === 214) {
        jokerTwoPosition = hand.length - 1;
      }
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
  let jokerCount = 0;
  unicodeHand.forEach((card, i) => {
    if (card === 127199 && jokerCount === 0) {
      handStr += `<div class="marker-row container${i}"><div class="card red">${String.fromCodePoint(
        card
      )}</div></div>`;
      jokerCount++;
    } else if (card > 127152 && card < 127184) {
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
  elem.scroll(0, elem.scrollHeight);
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
  if (movesRemaining === 0 && visibleMarkerCount > 1) {
    movePlayer(secondDieValue, markerChoice);
    updateMarkerPositions();
    showRollView();
  } else {
    movePlayer(firstDieValue, markerChoice);
    updateMarkerPositions();
    if (visibleMarkerCount === 1) {
      showRollView();
    }
  }
  target.classList.add("hidden");
  sentence.innerHTML = prompts[3];
}

function showRollView() {
  console.log("running showRollView");
  showMarkerChoices();
  sentence.classList.add("hidden");
  document.querySelector(".markers").classList.add("hidden");
  document.querySelector(".black-die").classList.add("dim");
  document.querySelector(".red-die").classList.add("dim");
  document.querySelector(".bullet").classList.add("dim");
  document.getElementById("rollBtn").classList.remove("hidden");
}

function switchUser() {
  document.querySelector(".show-header").addEventListener("mouseleave", () => {
    document.querySelector(".show-header").setAttribute("style", "opacity: 0");
  });
  userSpecialCards = [];
  console.log("running switchUser");
  ++currentPlayer;
  currentPlayer = currentPlayer % players.length;
  movesRemaining = 2;

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

  if (players[currentPlayer].isFinished) {
    switchUser();
  }
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
      markerToMove = "markerA";
      break;
    case "green-marker":
      markerToMove = "markerB";
      break;
    case "blue-marker":
      markerToMove = "markerC";
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

  console.log(
    "Previous Marker position: ",
    previousMarkerPosition,
    "\nCurrent player",
    players[currentPlayer].name,
    "\nMarker to move >",
    markerToMove,
    "\nStop value",
    stopValue,
    "\nChosen die value",
    dieMove,
    "\nMove count",
    moveCount
  );

  //check status if good do nothng else come back with previousMarkerPosition
  hasValidMove(dieMove, previousMarkerPosition, currentCard);
}

function updateMarkerPositions() {
  console.log("running updateMarkerPositions");
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
    if (players[playerIndex].markerA > -1) {
      spaces[
        players[playerIndex].markerA
      ].innerHTML += `<span class="marker-a">•</span>`;
    }
    if (players[playerIndex].markerB > -1) {
      spaces[
        players[playerIndex].markerB
      ].innerHTML += `<span class="marker-b">${String.fromCodePoint(
        9650
      )}</span>`;
    }
    if (players[playerIndex].markerC > -1) {
      spaces[
        players[playerIndex].markerC
      ].innerHTML += `<span class="marker-c">${String.fromCodePoint(
        9632
      )}</span>`;
    }
    if (specialCardFlag === false && movesRemaining < 1) {
      switchUser();
    }
  });
}

function hasValidMove(dieMove, previousMarkerPosition, currentCard) {
  let handLength = hand.length - 1;
  // first do all the things that should just return
  // remember moves have already been made, just not displayed yet
  if (players[currentPlayer][markerToMove] < handLength) {
    getSpecialCards(currentCard);

    if (userSpecialCards.length > 0 && movesRemaining < 1) {
      processSpecialCards();
    } else if (userSpecialCards.length === 0 && movesRemaining < 1) {
      // checkForAttack();
    }
    return;
  }
  if (previousMarkerPosition + dieMove === handLength) {
    if (
      players[currentPlayer].markerA === handLength &&
      players[currentPlayer].markerB === handLength &&
      players[currentPlayer].markerC === handLength
    ) {
      players[currentPlayer].isFinished = true;
      alert(players[currentPlayer].name + " wins!");
      return;
    }
    if (userSpecialCards.length > 0 && movesRemaining < 1) {
      processSpecialCards();
    }
    alert("Your Marker Has Finished");
    return;
  } else {
    alert("Move Not Allowed");
    players[currentPlayer][markerToMove] = previousMarkerPosition;
    currentPlayer += players.length % players.length;
    if (userSpecialCards.length > 0 && movesRemaining < 1) {
      processSpecialCards();
    }
    return;
  }
}

let userSpecialCards = [];
function getSpecialCards(currentCard) {
  console.log("running getSpecialCards");
  currentCardValue = (currentCard % 100) % 14;
  specialCards.forEach(specialCard => {
    if (currentCardValue === specialCard) {
      userSpecialCards.push(currentCard);
    }
  });
}

let specialCardFlag = false;
let furthestMarker = "";
function processSpecialCards() {
  console.log("running processSpecialCards");
  rollBtn.removeEventListener("click", rollBtnClick);
  rollBtn.innerHTML = `${players[currentPlayer].name} Has Special Card(s)<br/>Roll For Activation`;
  rollBtn.addEventListener("click", specialBtnClick, { once: true });

  function specialBtnClick() {
    rollBtn.removeEventListener("click", specialBtnClick, { once: true });
    specialCardRoll();
    decideActivation();
    document.querySelector(".bullet").classList.add("dim");
    rollBtn.innerHTML = `Ok`;
    rollBtn.addEventListener("click", pauseBtnClick);
  }

  function pauseBtnClick() {
    updateMarkerPositions();
    rollBtn.removeEventListener("click", pauseBtnClick);
    rollBtn.removeEventListener("click", specialBtnClick, { once: true });
    sentence.classList.add("hidden");
    userSpecialCards.forEach((card, i) => {
      if (card === furthestSpecialCard) {
        userSpecialCards.splice(i, 1);
      }
    });
    document.querySelector(".black-die").classList.add("dim");
    document.querySelector(".red-die").classList.add("dim");
    if (userSpecialCards.length === 0) {
      rollBtn.addEventListener("click", rollBtnClick);
      // checkForAttack();
      showRollView();
      switchUser();
      specialCardFlag = false;
    } else {
      console.log("running recursive call");
      if (userSpecialCards.length > 0 && movesRemaining < 1) {
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
    console.log("running decideActivation");
    let winningDieColor = "neither";
    if (blackDieValue + 1 > redDieValue + 1) {
      winningDieColor = "black";
    } else if (blackDieValue + 1 < redDieValue + 1) {
      winningDieColor = "red";
    }

    if (winningDieColor === furthestCardColor) {
      applyPenalty(furthestMarker, winningDieColor);
      if (
        players[currentPlayer].markerA === hand.length - 1 &&
        players[currentPlayer].markerB === hand.length - 1 &&
        players[currentPlayer].markerC === hand.length - 1
      ) {
        players[currentPlayer].isFinished = true;
        alert(players[currentPlayer].name + " wins!");
      }
    } else {
      sentence.innerHTML = `Card not activated<br>${furthestCardColor.toUpperCase()} die didn't win.`;
      sentence.classList.remove("hidden");
    }
  }

  function getFurthestSpecialCard() {
    let furthestMarkerEntry = ["", -1];
    let playerEntries = Object.entries(players[currentPlayer]);
    for (const [marker, position] of playerEntries) {
      if (userSpecialCards.includes(hand[players[currentPlayer][marker]])) {
        if (position > furthestMarkerEntry[1]) {
          furthestMarkerEntry = [marker, position];
        }
        furthestMarker = furthestMarkerEntry[0];
      }
    }

    let posA = -1;
    let posB = -1;
    let posC = -1;
    if (userSpecialCards.includes(hand[players[currentPlayer].markerA])) {
      posA = players[currentPlayer].markerA;
    }
    if (userSpecialCards.includes(hand[players[currentPlayer].markerB])) {
      posB = players[currentPlayer].markerB;
    }
    if (userSpecialCards.includes(hand[players[currentPlayer].markerC])) {
      posC = players[currentPlayer].markerC;
    }
    let furthestCardIndex = Math.max(posA, posB, posC);
    let furthestSpecialCard = hand[furthestCardIndex];
    return furthestSpecialCard;
  }

  if (userSpecialCards.length > 0) {
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
    players[currentPlayer][markerToMove] === players[i].markerA
      ? collisions.push(`Red marker `)
      : collisions;
    players[currentPlayer][markerToMove] === players[i].markerB
      ? collisions.push(`Green marker `)
      : collisions;
    players[currentPlayer][markerToMove] === players[i].markerC
      ? collisions.push(`Blue marker `)
      : collisions;
  }
  if (collisions.length > 0) {
    alert(
      `You are attacking ${collisions.length} marker(s)\nbut for now we're not doing anything about it.`
    );
  }
}

function initializePage() {
  document.querySelector(".show-header").addEventListener("mouseenter", () => {
    document.querySelector(".show-header").setAttribute("style", "opacity: 1");
  });
  document.querySelector(".show-header").addEventListener("mouseleave", () => {
    document.querySelector(".show-header").setAttribute("style", "opacity: .7");
  });

  document
    .getElementById("bg-image")
    .setAttribute("style", "background-image: url(images/dice2.jpg)");
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

  let headerMarkers = `<span id="red-marker">•</span><span id="green-marker">${String.fromCodePoint(
    9650
  )}</span
  ><span id="blue-marker">${String.fromCodePoint(9632)}</span>`;
  document.getElementById("markers").innerHTML = headerMarkers;

  let playersInfo = document.getElementById("players").value;
  playersArr = playersInfo.split(", ");
  getPlayerNames(playersArr);

  document
    .getElementById("dice")
    .insertAdjacentHTML(
      "afterend",
      `<button id="rollBtn" class="btn">${players[currentPlayer].name}<br/>Roll The Dice</button>`
    );

  document.getElementById("rollBtn").addEventListener("click", rollBtnClick);
}

function rollBtnClick() {
  document.querySelector(".show-header").addEventListener("mouseenter", () => {
    document
      .querySelector(".show-header")
      .removeAttribute("style", "opacity: 1");
  });
  document.querySelector(".show-header").addEventListener("mouseleave", () => {
    document
      .querySelector(".show-header")
      .removeAttribute("style", "opacity: .7");
  });

  rollDice();
}

function getPlayerNames(playersArr) {
  class Player {
    constructor(name) {
      this.markerA = -1;
      this.markerB = -1;
      this.markerC = -1;
      this.name = name;
      this.isFinished = false;
      players.push(this);
    }
  }

  (function() {
    for (let i = 0; i < playersArr.length; i++) {
      new Player(playersArr[i]);
    }
  })();

  playersNames.classList.add("hidden");
  document.getElementById("prompts").classList.add("hidden");

  renderPlayers();
  renderBoard();

  document.querySelectorAll(".marker-row").forEach(li => {
    li.innerHTML += "";
  });

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
  document.querySelector(".red-die").classList.add("die-animate");
  document.querySelector(".black-die").classList.add("die-animate");
  setTimeout(() => {
    dice =
      '<div class="red-die">' +
      dice1 +
      '</div><div class="bullet dim">•</div><div class="black-die">' +
      dice2 +
      "</div>";
    diceContainer.innerHTML = dice;
    document.querySelector(".red-die").classList.remove("die-animate");
    document.querySelector(".black-die").classList.remove("die-animate");
  }, 800);
}

function applyPenalty(furthestMarker, winningDieColor) {
  console.log("running applyPenalty");
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
    sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— King is activated —<br>
      — moving up 1 row —`;
    sentence.classList.remove("hidden");
    players[currentPlayer][furthestMarker] += forwardSpacesToMove;

    if (players[currentPlayer][furthestMarker] > hand.length - 1) {
      players[currentPlayer][furthestMarker] = hand.length - 1;
      if (
        !(
          players[currentPlayer].markerA === hand.length - 1 &&
          players[currentPlayer].markerB === hand.length - 1 &&
          players[currentPlayer].markerC === hand.length - 1
        )
      ) {
        sentence.classList.add("hidden");
        sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— King is activated —<br>
          — Your marker has finished —`;
        sentence.classList.remove("hidden");
      }
    }
  }

  function pullForwards() {
    sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Queen is activated —<br>
    — pulling your nearest marker forward —`;
    sentence.classList.remove("hidden");
    currentPosition = players[currentPlayer][furthestMarker];
    let sortedMarkers = sortPlayerMarkers();
    let markerToMove = sortedMarkers.filter(marker => {
      return marker[3] < currentPosition;
    });
    if (markerToMove.length > 0 && markerToMove[0][3] !== -1) {
      markerToMove = markerToMove[0][2];
      players[currentPlayer][markerToMove] = currentPosition;
    } else {
      sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins. <br>— Queen is activated —<br>
      But you have no marker to pull forward.`;
      sentence.classList.remove("hidden");
    }
  }

  function pushBackwards() {
    currentPosition = players[currentPlayer][furthestMarker];
    let closestPlayer = [];
    let opponentIndex = 0;

    let sortedMarkers = sortOpponentMarkers(players);
    let markerList = sortedMarkers.filter(marker => {
      return marker[2] > currentPosition;
    });
    if (markerList.length > 0) {
      closestPlayer = markerList[markerList.length - 1];
      players.forEach((player, i) => {
        if (player.name === closestPlayer[0]) {
          opponentIndex = i;
        }
      });

      if (players[opponentIndex].isFinished === false) {
        players[opponentIndex][closestPlayer[1]] = currentPosition;
        sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Jack is activated —<br>
        Getting random opponent 3`;

        setTimeout(
          () =>
            (sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Jack is activated —<br>
            Getting random opponent 2`),
          1200
        );

        setTimeout(
          () =>
            (sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Jack is activated —<br>
            Getting random opponent 1`),
          2400
        );

        setTimeout(
          () =>
            (sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Jack is activated —<br>— pulling ${
              players[opponentIndex].name
            }s' nearest marker back —`),
          3000
        );
        sentence.classList.remove("hidden");
      }
    } else {
      sentence.innerHTML = `The ${winningDieColor.toUpperCase()} die wins. <br>— Jack is activated —<br>But there's nobody to pull back.`;
      sentence.classList.remove("hidden");
    }
  }

  function chute() {
    sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Ace is activated —<br>
    — moving down 1 row —`;
    sentence.classList.remove("hidden");
    players[currentPlayer][furthestMarker] -= backwardSpacesToMove;
    console.log(players[currentPlayer][furthestMarker], "chute1");
    if (players[currentPlayer][furthestMarker] < 0) {
      players[currentPlayer][furthestMarker] = 0;
      console.log(players[currentPlayer][furthestMarker], "chute2");
      sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Ace is activated —<br>
      — moving back to beginning —`;
      sentence.classList.remove("hidden");
    }
  }

  function swap() {
    currentPosition = players[currentPlayer][furthestMarker];
    let opponentIndex = 0;
    let sortedMarkers = sortOpponentMarkers(players);
    let filteredMarkers = sortedMarkers.filter(player => {
      return player[2] !== currentPosition || player[2] !== -1;
    });
    let randomIndex = Math.floor(Math.random() * filteredMarkers.length);
    let randomPlayer = [];
    randomPlayer = filteredMarkers[randomIndex];
    console.log(randomPlayer);
    if (filteredMarkers.length > 0) {
      players.forEach((player, i) => {
        if (player.name === randomPlayer[0]) {
          opponentIndex = i;
        }
      });
      console.log(
        players[opponentIndex][randomPlayer[1]],
        currentPosition,
        "swap"
      );
      players[currentPlayer][furthestMarker] =
        players[opponentIndex][randomPlayer[1]];
      players[opponentIndex][randomPlayer[1]] = currentPosition;

      sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Two is activated —<br>
      Getting random swap 3`;

      setTimeout(
        () =>
          (sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Two is activated —<br>
          Getting random swap 2`),
        1200
      );

      setTimeout(
        () =>
          (sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Two is activated —<br>
          Getting random swap 1`),
        2400
      );

      setTimeout(
        () =>
          (sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins.<br>— Two is activated —<br>— swapping places with one of ${
            players[opponentIndex].name
          }s' markers —`),
        3000
      );

      sentence.classList.remove("hidden");
    } else {
      sentence.innerHTML = `${winningDieColor.toUpperCase()} die wins. <br>— Two is activated —<br>But nobody to swap with.`;
      sentence.classList.remove("hidden");
    }
  }
}

function rollDice() {
  console.log("running rollDice");
  movesRemaining = 2;
  redDieValue = Math.floor(Math.random() * 6);
  let dice1 = dieStr[redDieValue];
  blackDieValue = Math.floor(Math.random() * 6);
  let dice2 = dieStr[blackDieValue];
  document.querySelector(".red-die").classList.add("die-animate");
  document.querySelector(".black-die").classList.add("die-animate");
  setTimeout(() => {
    dice =
      '<div class="red-die">' +
      dice1 +
      '</div><div class="bullet">•</div><div class="black-die">' +
      dice2 +
      "</div>";
    diceContainer.innerHTML = dice;
    document.querySelector(".red-die").classList.remove("dim");
    document.querySelector(".black-die").classList.remove("dim");
    document.querySelector(".red-die").classList.remove("die-animate");
    document.querySelector(".black-die").classList.remove("die-animate");
    rollBtn.classList.add("hidden");
    showMarkerChoices();
    diceEvents();
  }, 800);
}

let visibleMarkerCount = 3;
function showMarkerChoices() {
  console.log("running showMarkerChoices");

  document
    .getElementById("green-marker")
    .removeEventListener("click", markerClick);
  document
    .getElementById("red-marker")
    .removeEventListener("click", markerClick);
  document
    .getElementById("blue-marker")
    .removeEventListener("click", markerClick);

  visibleMarkerCount = 3;
  players[currentPlayer].markerA < hand.length - 1
    ? document.getElementById("red-marker").classList.remove("hidden")
    : (document.getElementById("red-marker").classList.add("hidden"),
      visibleMarkerCount--);

  players[currentPlayer].markerB < hand.length - 1
    ? document.getElementById("green-marker").classList.remove("hidden")
    : (document.getElementById("green-marker").classList.add("hidden"),
      visibleMarkerCount--);
  players[currentPlayer].markerC < hand.length - 1
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
  updateMarkerPositions();
  opponents = players.filter((player, i) => {
    return i !== currentPlayer;
  });
  let markers = [];
  opponents.forEach(player => {
    for (let key in player) {
      if (key !== "name" && key !== "isFinished") {
        markers.push([player.name, key, player[key]]);
      }
    }
  });
  let filteredMarkers = markers.filter(marker => {
    return safetyCardPositions.indexOf(marker[2]) === -1;
  });
  let sortedMarkers = filteredMarkers.sort((b, a) => {
    return a[2] - b[2];
  });
  return sortedMarkers;
}

function sortPlayerMarkers() {
  updateMarkerPositions();
  let markers = [];
  for (let key in players[currentPlayer]) {
    if (key !== "name" && key !== "isFinished") {
      markers.push([
        players[currentPlayer].index,
        players[currentPlayer].name,
        key,
        players[currentPlayer][key]
      ]);
    }
  }
  let filteredMarkers = markers.filter(marker => {
    return safetyCardPositions.indexOf(marker[3]) === -1;
  });
  let sortedMarkers = filteredMarkers.sort((b, a) => {
    return a[3] - b[3];
  });
  return sortedMarkers;
}
