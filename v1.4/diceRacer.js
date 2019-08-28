function game(){

  class Player {
    position = -1;
  }

  const player1 = new Player();
  const player2 = new Player();

  let deck = createDeck(28);
  let hand = generateHand();

  const rollDie = ((numSides = 6) => Math.floor(Math.random() * numSides) + 1);

  function createDeck(deckSize) {
    let deck = [];
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
    let hand = [];
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


  }
  console.log(rollDie());
}

game();