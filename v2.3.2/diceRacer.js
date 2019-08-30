
function game(player_1, player_2, logging){
  const players = [];

  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let deck = [], hand = [];
  let player1, player2;
  const rollDie = ((numSides = 6) => Math.floor(Math.random() * numSides) + 1);

  runGame();

  function runGame(player_1, player_2) {
    initializeGame(player_1, player_2);
    let i = 0;
    function promptPlayer(currentPlayer){
      let dieChoice, markerChoice;
      let dRoll = diceRoll();
      console.log(`\n${currentPlayer.name}'s black die rolled a: ${dRoll[0]}`);
      console.log(`and the red die rolled a: ${dRoll[1]}\n`);
      rl.question("Enter your die choice:\n'b' for black, 'r' for red, or 'enter' for both:\n", (userInput) => {
        switch (userInput){
          case 'b':
            dieChoice = dRoll[0];
            break;
          case 'r':
            dieChoice = dRoll[1];
            break;
          default:
            dieChoice = dRoll[0] + dRoll[1];
        }
        rl.question("Which marker do you want to move?\n'a', 'b', or 'c'\n", (userInput) => {
          switch(userInput) {
            case 'a':
              markerChoice = "markerAPos";
              break;
            case 'b':
              markerChoice = "markerBPos";
              break;
            case 'c':
              markerChoice = "markerCPos";
              break;
            default:
              markerChoice = "markerAPos";
          }
        currentPlayer[markerChoice] = movePlayer(currentPlayer, dieChoice, markerChoice);
        logGameStats(currentPlayer, userInput, markerChoice);
        promptPlayer(players[++i % 2]);
        });
      });
    }
    promptPlayer(player1);
  }

  function logGameStats(currentPlayer, userInput, markerChoice){
    players.forEach((player)=>{
    console.log(player.name + 's\'', 'position for marker a  is: ', player.markerAPos + 1);
    console.log(player.name + 's\'', 'position for marker b  is: ', player.markerBPos + 1);
    console.log(player.name + 's\'', 'position for marker c  is: ', player.markerCPos + 1);
//    console.log('\n');
  });

//   logging ? console.log(currentPlayer.name + 's\'', 'position for marker ' + userInput.toUpperCase() + ' is: ', currentPlayer[markerChoice] + 1) : null;
//   console.log(players);
  }

  function initializeGame(){
    // The createDeck function works with multiples of 4
    // so create a deck of 56 cards then pop off the last 2 jokers
    // to arrive at a deck size of 54
    deck = createDeck(56);
    deck.pop();
    deck.pop();

    hand = generateHand();

    logging ? console.log(hand) : null;

    class Player {
      constructor(name) {
        this.markerAPos = -1;
        this.markerBPos = -1;
        this.markerCPos = -1;
        this.name = name;
        players.push(this);
      }
    }
    player1 = new Player(player_1);
    player2 = new Player(player_2);
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
    fromEnd !== deck.length ? fromEnd = deck.length - fromEnd : fromEnd;
    let random = Math.floor(Math.random() * (fromEnd - startPos)) + startPos;
    let card = deck[random];
    deck.splice(random, 1);
    return card;
  }

  // Generate a "track" **Do not allow jack, queen, king, ace, or joker in either
  // first 3 or last 3 markerAPoss.
  function generateHand(){
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

  function movePlayer(player, dieRoll, markerToMove){
    for (let i = player[markerToMove] + 1; i < hand.length; i++) {
      if(hand[i] % 100 < dieRoll) {
        player[markerToMove]++;
      } else {
        player[markerToMove]++;
        break;
      }
    }
    return player[markerToMove];
  }
}

game("Tom", "Jackie", logging = true);