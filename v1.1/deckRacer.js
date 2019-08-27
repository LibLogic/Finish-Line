const rollDie = (numSides => Math.floor(Math.random() * numSides) + 1);

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

let roll = rollDie(6);

let deck = createDeck(28);

console.log(deck, roll);