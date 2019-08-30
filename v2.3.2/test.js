let markerChoice;


const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

  dieChoice = (dRoll[0] + dRoll[1]) - dieChoice;
  currentPlayer[markerChoice] = movePlayer(currentPlayer, dieChoice, markerChoice);
  console.clear();
  console.log(hand, '\n');
  logGameStats();