const WebSocket = require("ws");
const clients = require("./clientes-arduino.js");
function onError(ws, err) {
  console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
  console.log(`Mensagem Recebida: ${data}`);
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
    ws.send(`Desconectado ao WebSocket para Arduino`);
    clients.delete(ws);
  });
  console.log(`Conexão no WebSocket para Arduino`);
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const Inform2 = function Inform2(message) {
  const outbound = JSON.stringify(message);

  [...clients.keys()].forEach((client) => {
    client.send(outbound);
  });
};

/*
const interval = setInterval(() => {
  [...clients.keys()].forEach((client) => {
    console.log(client.readyState);
  });
}, 30000);
*/

exports.on = (server) => {
  const wss = new WebSocket.Server({
    server,
  });

  wss.on("connection", onConnection);

  console.log(`NodeMCU Web Socket Online!`);
  return wss;
};
exports.Inform2 = Inform2;