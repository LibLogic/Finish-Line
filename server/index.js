const server = require("ws").Server;

const ss = new server({
  port: 5500
});

let playerList = [];
let gameLength = [];
let gameHand = [];
let length = "";
ss.on("connection", ws => {
  let clientCount = 0;
  ss.clients.forEach(client => {
    clientCount++;
    client.send(
      JSON.stringify({
        type: "clientCount",
        data: { clientCount: clientCount }
      })
    );
  });
  console.log("New Connection");

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
    }
    if (obj.type === "gameLength") {
      if (obj.type === "gameLength") {
        ws.gameLength = obj.data.gameLength;
        gameLength.push(ws.gameLength);
      }
      length = gameLength.filter(length => {
        return length !== -1;
      });
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "gameLength",
            data: { gameLength: length }
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
      playerList.push(client.playerName);
      client.send(
        JSON.stringify({
          type: "playerName",
          data: { playerList: playerList }
        })
      );
      client.send(
        JSON.stringify({
          type: "clientCount",
          data: { clientCount: clientCount }
        })
      );
      console.log("Connection CLOSED");
      console.log(clientCount);
    });
  });
});
