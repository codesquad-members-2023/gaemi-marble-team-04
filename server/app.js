const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8080;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const clients = {};
const users = {};
let userActivity = [];

const broadcastMessage = (json) => {
  const data = JSON.stringify(json);

  for (const userId in clients) {
    const client = clients[userId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
};

const handleMessage = (message, userId) => {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === "dice") {
    users[userId] = dataFromClient;
    userActivity.push(`${dataFromClient.playerId} roll the dice`);
    const dice1 = Math.floor(Math.random() * 6 + 1);
    const dice2 = Math.floor(Math.random() * 6 + 1);
    json.data = { dice1, dice2 };
  } else {
    return;
  }
  broadcastMessage(json);
};

const handleDisconnect = (userId) => {
  console.log(`${userId} disconnected.`);
  const json = { type: "disconnect" };
  const username = users[userId]?.username || userId;
  userActivity.push(`${username} left the game`);
  json.data = { users, userActivity };

  delete clients[userId];
  delete users[userId];
  broadcastMessage(json);
};

wsServer.on("connection", function (connection) {
  console.log(`Recieved a new connection.`);
  const userId = uuidv4();
  clients[userId] = connection;
  console.log(`User ${userId} connected.`);
  // 클라이언트로부터 메시지를 받았을 때 이벤트 처리
  connection.on("message", (message) => handleMessage(message, userId));
  connection.on("close", () => handleDisconnect(userId));
});
