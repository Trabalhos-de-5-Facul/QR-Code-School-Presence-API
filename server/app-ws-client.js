const WebSocket = require("ws");

const WebSocketClient = () => {
    const con = new WebSocket('ws://192.168.0.165:80/ws');
    console.log("Tentando conectar...");
    con.onmessage = async (res) => {
      console.log(res.data);
      con.send('pong');
      
    }
  }

module.exports = { WebSocketClient };