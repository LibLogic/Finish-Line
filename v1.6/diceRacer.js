function game(){
  let deck = [], hand = [];
  let player1, player2;
  const rollDie = ((numSides = 6) => Math.floor(Math.random() * numSides) + 1);

  runGame("Tom", "Jackie", logging = true);

  function initializeGame(player_1, player_2){
    deck = createDeck(28);
    hand = generateHand();
    logging ? console.log(hand) : null;

    class Player {
      position = -1;
      constructor(name) {
        this.name = name;
      }
    }
    player1 = new Player(player_1);
    player2 = new Player(player_2);
  }

function runGame(player_1, player_2) {
  initializeGame(player_1, player_2);

  while(player1.position < hand.length - 1 && player2.position < hand.length - 1) {
    player1.position = movePlayer(player1);
    logging ? console.log(player1.name + 's\'', 'position: ', player1.position) : null;
    player2.position = player1.position !== hand.length - 1 ? movePlayer(player2) : player2.position;
    if (logging) {
      console.log(player2.name + 's\'', 'position: ', player2.position);
      player2.position === hand.length -1 ? console.log(player1.name + 's\'', 'position: ', player1.position) : null;
    }
  }
    let winner = player1.position == hand.length -1 ? player1.name + " is the winner!" : player2.name + " is the winner!";
    console.log('\n' + winner);
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

  // Generate a "track" **Do not allow ace, two, six or seven in either
  // first 2 or last 2 positions.
  function generateHand(){
    let handCenter = [];
    // lets generate the two ends first then
    // insert the remaining cards into the middle
    for (let i = 0; i < 4; i++) {
      hand.push(drawCard(8, 9));
    }
    // Generate and insert middle
    let deckSize = deck.length;
    for (let i = 0; i < deckSize; i++) {
      handCenter.push(drawCard());
    }
    hand.splice(2, 0, ...handCenter);
    return hand;
  }

  function movePlayer(player){
    let dieRoll = rollDie();
    logging ?console.log('\n' + player.name, 'rolls: ', dieRoll) : null;
    for (let i = player.position + 1; i < hand.length; i++) {
      if(hand[i] % 100 < dieRoll) {
        player.position++;
      } else {
        player.position++;
        break;
      }
    }
    return player.position;
  }
}

game();