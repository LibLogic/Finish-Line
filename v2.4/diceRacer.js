function game() {
  const readline = require("readline");
  function makeInterface() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return rl;
  }

  const players = [];
  let deck = [],
    hand = [];
  const rollDie = (numSides = 6) => Math.floor(Math.random() * numSides) + 1;

  runGame();
  function runGame() {
    initializeGame();
    playerPrompts(players[0]);

    let i = 0;
    function playerPrompts(currentPlayer) {
      let dRoll = diceRoll();
      let diceTotal = dRoll[0] + dRoll[1];
      console.log(`\n${currentPlayer.name}s' Roll: \nBlack rolls: ${dRoll[0]}`);
      console.log(`Red rolls: ${dRoll[1]}\n`);
      dieQuestion(diceTotal, dRoll, currentPlayer);
    }

    function dieQuestion(diceTotal, dRoll, currentPlayer) {
      const rl = makeInterface();
      let dieChoice, markerToMove;
      rl.question("Enter your die choice:\n'b' for black, 'r' for red, or 'enter' for both:\n", userInput => {
          dieChoice = getDieChoice(userInput, diceTotal, dRoll);
          rl.close();
        });

      rl.on("close", () => { ////
        const rl = makeInterface();
        rl.setPrompt(`\nWhich marker would you like to move?\n'a', 'b', or 'c'\n`);
        rl.prompt();
        rl.on('line', userInput => { ////
          markerToMove = getMarkerChoice(userInput);
          if (moveCheck(currentPlayer, markerToMove)) {
            rl.setPrompt(`\n${currentPlayer.name}, that marker is finished. Please try again.\n'a', 'b', or 'c'\n`);
            rl.prompt();
          } else
            if (userInput === "a" || userInput === "b" || userInput === "c") {
              markerToMove = getMarkerChoice(userInput, currentPlayer);
              rl.close();
            } else {
              rl.setPrompt(
                `\n${currentPlayer.name}, only choose either 'a', 'b', or 'c' `
              );
              rl.prompt();
            }
        }); //// on('line') ////

        rl.on("close", () => { ////////
          currentPlayer[markerToMove] = movePlayer(currentPlayer, dieChoice, markerToMove);
          if (dieChoice === diceTotal) {
            rl.close();
            playerPrompts(players[++i % players.length]);
          } else {
            const rl = makeInterface();
            rl.setPrompt(`\nOk ${currentPlayer.name}, which marker would you like to move now?\n'a', 'b', or 'c'\n`);
            rl.prompt();
            rl.on("line", userInput => { ///////
            markerToMove = getMarkerChoice(userInput, currentPlayer);
            if (moveCheck(currentPlayer, markerToMove)) {
              rl.setPrompt(`\n${currentPlayer.name}, that marker is finished. Please try again.\n'a', 'b', or 'c'\n`);
              rl.prompt();
            } else
              if (userInput === "a" || userInput === "b" || userInput === "c") {
                currentPlayer[markerToMove] = movePlayer(currentPlayer, diceTotal - dieChoice, markerToMove);
                rl.close();
                playerPrompts(players[++i % players.length]);
              } else {
                rl.setPrompt(
                  `\n${currentPlayer.name}, only choose either 'a', 'b', or 'c' `
                );
                rl.prompt();
              }
            }); // rl.on('line') ////////
          } // else
        }); // rl.on('close') ////////
      });
    } // dieQuestion
  } // run game

  function getDieChoice(userInput, diceTotal, dRoll) {
    switch (userInput) {
      case "b":
        dieChoice = dRoll[0];
        break;
      case "r":
        dieChoice = dRoll[1];
        break;
      default:
        dieChoice = diceTotal;
    }
    return dieChoice;
  }

  function getMarkerChoice(userInput) {
    switch (userInput) {
      case "a":
        markerToMove = "markerAPos";
        break;
      case "b":
        markerToMove = "markerBPos";
        break;
      case "c":
        markerToMove = "markerCPos";
        break;
      default:
        markerToMove = "markerAPos";
    }
    return markerToMove;
  }

  function logGameStats(currentPlayer, markerToMove) {
    console.clear();
    console.log('\n\n', hand, '\n');
    if (currentPlayer.markerAPos >= hand.length && currentPlayer.markerBPos >= hand.length && currentPlayer.markerCPos >= hand.length) {
      console.log(`\n\n${currentPlayer.name} 'wins!'\n`);
      process.exit();
    } else {
      players.forEach(player => {
        let str = `${player.name}s' marker positions are:`.padEnd(36, " ");
        let str1 = `A:${player.markerAPos + 1}`.padEnd(7, " ");
        let str2 = `B:${player.markerBPos + 1}`.padEnd(7, " ");
        let str3 = `C:${player.markerCPos + 1}`.padEnd(7, " ");
        console.log(`${str}${str1}${str2}${str3}`);
      });
    }
  }

  function moveCheck(currentPlayer, markerToMove) {
    let posFromEnd = hand.length - markerToMove;
      if (currentPlayer[markerToMove] >= hand.length - 1) {
        return true;
      }
      return false;
  }

  function initializeGame() {
    // The createDeck function works with multiples of 4
    // so create a deck of 56 cards then pop off the last 2 jokers
    // to arrive at a deck size of 54
    deck = createDeck(56);
    deck.pop();
    deck.pop();

    hand = generateHand();

    class Player {
      constructor(name) {
        this.markerAPos = -1;
        this.markerBPos = -1;
        this.markerCPos = -1;
        this.name = name;
        players.push(this);
      }
    }

    // createPlayers from arguments list
    (function() {
      for (let i = 0; i < game.arguments.length; i++) {
        let username = "player" + (i + 1);
        username = new Player(game.arguments[i]);
      }
    })();

    logGameStats(players[0]);
  }

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
  // first 3 or last 3 markerAPoss.
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

  function diceRoll() {
    let blackDie = rollDie(6);
    let redDie = rollDie(6);
    return [blackDie, redDie];
  }

  function movePlayer(player, dieRoll, markerToMove) {
    for (let i = player[markerToMove] + 1; i < hand.length; i++) {
      if (hand[i] % 100 < dieRoll) {
        player[markerToMove]++;
        logGameStats(player, markerToMove);
      } else {
        player[markerToMove]++;
        logGameStats(player, markerToMove);
        break;
      }
    }
    return player[markerToMove];
  }
}

game("Tom", "Jackie", "Vrishali", "Cliff");