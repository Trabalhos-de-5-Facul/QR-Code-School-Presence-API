const WebSocket = require("ws");

const clients = new Map();

function onError(ws, err) {
  console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
  console.log(`onMessage: ${data}`);
  ws.send(`recebido`);
  const message = JSON.parse(data);
  const metadata = clients.get(ws);
  message.sender = metadata.id;
  message.color = metadata.color;

  const outbound = JSON.stringify(message);

  [...clients.keys()].forEach((client) => {
    client.send(outbound);
  });
}

function onConnection(ws, req) {
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };
  clients.set(ws, metadata);

  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (error) => onError(ws, error));
  ws.on("close", () => {
    clients.delete(ws);
  });
  console.log(`onConnection`);
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/*
wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    ws.on("message", (data) => onMessage(ws, data));
    ws.on("error", (error) => onError(ws, error));
    console.log(`onConnection`);
}
*/

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server,
  });

  wss.on("connection", onConnection);

  console.log(`App Web Socket Server is running!`);
  return wss;
};
