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

    if (obj.type === "playerName") {
      ws.playerName = obj.data.playerName;
      playerList.push(ws.playerName);
      obj.data.playerList = playerList;
      ss.clients.forEach(client => {
        client.send(JSON.stringify(obj));
      });
    }
    if (obj.type === "gameData") {
      if (obj.type === "gameData") {
        ws.gameLength = obj.data.gameLength;
        ws.gameHand = obj.data.gameHand;
        gameLength.push(ws.gameLength);
        gameHand.push(ws.gameHand);
      }
      length = gameLength.filter(length => {
        return length !== -1;
      });
      ss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "gameData",
            data: { gameLength: length, gameHand: gameHand }
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
