const server = require("ws").Server;

const port = process.env.PORT || 5500;

const ss = new server({
  port: port
});

let playerList = [];
let gameLength = [];
let gameHand = [];
let length = [];
ss.on("connection", ws => {
  ss.clients.forEach(client => {
    if (length && ss.clients.size > length[0]) {
      ws.close();
    }
    ws.clientId = ss.clients.size - 1;
    client.send(
      JSON.stringify({
        type: "clientOpen",
        data: {
          clientCount: ss.clients.size,
          clientId: ws.clientId
        }
      })
    );
  });
  console.log("New Connection");
  console.log(ss.clients.size);

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
    } else if (obj.type === "activatePlayerBtn") {
      ss.clients.forEach(client => {
        if (
          client.clientId === obj.data.activePlayer
          //           || ss.clients.size === 1
        ) {
          client.send(
            JSON.stringify({
              type: "activatePlayerBtn",
              data: {
                listenerType: obj.data.listenerType,
                activePlayer: obj.data.activePlayer
              }
            })
          );
        }
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
    clientIdList = [];
    gameLength = [];
    gamehand = [];
    newPlayerList = [];
    ss.clients.forEach(client => {
      newPlayerList.push(client.playerName);
      clientIdList.push(client.clientId);
    });
    playerList = newPlayerList;
    ss.clients.forEach(client => {
      client.send(
        JSON.stringify({
          type: "clientClose",
          data: {
            clientIdList: clientIdList,
            clientCount: ss.clients.size,
            playerList: playerList
          }
        })
      );
    });
    console.log("Connection CLOSED");
    console.log(ss.clients.size);
  });
});
