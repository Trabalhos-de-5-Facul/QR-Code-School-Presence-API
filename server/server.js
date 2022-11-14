const http = require("http");
const app = require("./app");
const appWs = require("./app-ws");
const { WebSocketClient } = require("./app-ws-client");
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server listening on port " + port + ".");
});

appWs.on(server);
//WebSocketClient();