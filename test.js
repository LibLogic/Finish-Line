let playersInfo = "Tom, Bob, Cliff, Steve";
playersArr = playersInfo.split(", ");
getPlayerNames(playersArr);
var players;

function getPlayerNames(playersArr) {
  players = [];
  class Player {
    constructor(name) {
      this.markerA = 14;
      this.markerB = 28;
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
}

console.log(sortOpponentMarkers(players));

function sortOpponentMarkers(players) {
  let currentPlayer = 1;
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
  let sortedMarkers = markers.sort((b, a) => {
    return a[2] - b[2];
  });
  return sortedMarkers;
}
