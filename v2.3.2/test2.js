function playerPrompts() {
  let dieChoice, markerChoice;
  let dRoll = diceRoll();
  console.log(`\n${currentPlayer.name}s' Roll: \nBlack rolls: ${dRoll[0]}`);
  console.log(`Red rolls: ${dRoll[1]}\n`);
  questionOne();
}

function questionOne() {
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
    console.clear();
    console.log(hand, '\n');
    questionTwo();
  });
}

function questionTwo () {
 rl.question("Which marker would you like to move?\n'a', 'b', or 'c'\n", (userInput) => {
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
    console.clear();
    console.log(hand, '\n');
    logGameStats();
    promptPlayer(players[++i % players.length]);
  });
}