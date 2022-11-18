const http = require("http");
const app = require("./app");
const appWs = require("./app-ws");
const appWs2 = require("./app-ws2");
const port = process.env.PORT || 3000;
const port2 = 3001;
const server = http.createServer(app);
const server2 = http.createServer(app);

server.listen(port, () => {
  console.log("Server listening on port " + port + ".");
});

server2.listen(port2, () => {
  console.log("Server listening on port " + port2 + ".");
});

appWs.on(server);
appWs2.on(server2);
