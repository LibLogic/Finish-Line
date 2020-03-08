const server = require("ws").Server;

const ss = new server({
  port: 5500
});

let clientCount = 0;
let playerList = [];
let gameLength = [];
let gameHand = [];
let length = [];
ss.on("connection", ws => {
  clientCount++;
  ss.clients.forEach(client => {
    client.send(
      JSON.stringify({
        type: "clientCount",
        data: { clientCount: clientCount }
      })
    );
  });
  console.log("New Connection");
  console.log(clientCount);

  ws.on("message", message => {
    let obj = JSON.parse(message);

    if (obj.type === "gameData") {
      ws.playerName = obj.data.playerName;
      playerList.push(ws.playerName);
      ws.gameHand = obj.data.gameHand;
      gameHand.push(ws.gameHand);
      obj.data.playerList = playerList;
      ss.clients.forEach(client => {
        client.send(JSON.stringify(obj));
      });
    } else if (obj.type === "gameLength") {
      ws.gameLength = obj.data.gameLength;
      gameLength.push(ws.gameLength);
      length = gameLength.filter(len => {
        return len !== -1;
      });
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "gameLength",
            data: { gameLength: length[0] }
          })
        );
      });
    } else if (obj.type === "dieRoll") {
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "dieRoll",
            data: {
              redDieValue: obj.data.redDieValue,
              blackDieValue: obj.data.blackDieValue,
              dice1: obj.data.dice1,
              dice2: obj.data.dice2
            }
          })
        );
      });
    } else if (obj.type === "specialRoll") {
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "specialRoll",
            data: {
              redDieValue: obj.data.redDieValue,
              blackDieValue: obj.data.blackDieValue,
              dice1: obj.data.dice1,
              dice2: obj.data.dice2,
              userSpecialCards: obj.data.userSpecialCards
            }
          })
        );
      });
    } else if (obj.type === "okClick") {
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "okClick"
          })
        );
      });
    } else if (obj.type === "dieClick") {
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "dieClick",
            data: {
              eventTarget: obj.data.eventTarget
            }
          })
        );
      });
    } else if (obj.type === "markerClick") {
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "markerClick",
            data: {
              eventTarget: obj.data.eventTarget
            }
          })
        );
      });
    }
  });

  ws.on("close", ws => {
    playerList = [];
    gameLength = [];
    gamehand = [];
    clientCount = 0;
    ss.clients.forEach(client => {
      clientCount++;
    });
    ss.clients.forEach(client => {
      client.send(
        JSON.stringify({
          type: "clientCount",
          data: { clientCount: clientCount }
        })
      );
      playerList.push(ws.playerName);
      client.send(
        JSON.stringify({
          type: "playerName",
          data: { playerList: playerList }
        })
      );
    });
    console.log("Connection CLOSED");
    console.log(clientCount);
  });
});
