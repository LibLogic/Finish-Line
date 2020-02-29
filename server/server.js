const server = require("ws").Server;

const ss = new server({
  port: 5500
});

ss.on("connection", ws => {
  console.log("New Connection");
  ws.on("message", message => {
    ss.clients.forEach(client => {
      client.send(message);
    });
  });

  ws.on("close", ws => {
    console.log("Connection CLOSED");
  });
});
