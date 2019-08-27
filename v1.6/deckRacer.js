function game(){
  let deck = [], hand = [];

  let player1, player2;

  const rollDie = ((numSides = 6) => Math.floor(Math.random() * numSides) + 1);

  initializeGame("Tom", "Jackie");

console.log(hand);

  function initializeGame(player_1, player_2){
    deck = createDeck(28);
    hand = generateHand();

    class Player {
      position = -1;
      constructor(name) {
        this.name = name;
      }
    }
    player1 = new Player(player_1);
    player2 = new Player(player_2);
  }

while(player1.position < hand.length - 1 && player2.position < hand.length - 1) {
  player1.position = movePlayer(player1);
  console.log(player1.name + 's\'', 'position: ', player1.position);
  player2.position = player1.position !== hand.length - 1 ? movePlayer(player2) : player2.position;
  console.log(player2.name + 's\'', 'position: ', player2.position);
  player2.position === hand.length -1 ? console.log(player1.name + 's\'', 'position: ', player1.position) : null;
}
  let winner = player1.position == hand.length -1 ? "Tom is the winner!" : "Jackie is the winner!";
  console.log('\n' + winner);

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
  function drawCard(start = 0, end = deck.length) {
    let random = Math.floor(Math.random() * (end - start)) + start;
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
      hand.push(drawCard(8, 17));
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
    console.log('\n' + player.name, 'rolls: ', dieRoll);
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